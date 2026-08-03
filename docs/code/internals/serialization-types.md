# Serialization Types in the Zano Codebase

In the Zano codebase you may encounter a concept called a **serialization map**. In fact, you will see three different serialization mechanisms used to store C++ objects, and some structures even contain all three maps side by side, each following a different principle.
Here is an example of declaration of **asset_descriptor_base** structure, that includes 3 different serialization maps. 
```
  struct asset_descriptor_base
  {
    uint64_t            total_max_supply = 0;
    uint64_t            current_supply = 0;
    uint8_t             decimal_point = 0;
    std::string         ticker;
    std::string         full_name;
    std::string         meta_info;
    crypto::public_key  owner = currency::null_pkey; // consider premultipling by 1/8
    bool                hidden_supply = false;
    uint8_t             version = ASSET_DESCRIPTOR_BASE_HF4_VER;
    //version 1 members
    boost::optional<crypto::eth_public_key> owner_eth_pub_key; // note: the size is 33 bytes (if present) // NOTE: using boost::optional instead of std::optional because of the Boost compilation issue: https://github.com/boostorg/serialization/issues/319 -- sowle
    //version 2 members
    std::vector<asset_descriptor_base_etc_fields> etc;  //container for future use if we would be adding some optional parameters that is not known yet, but without mess related to format version


    BEGIN_VERSIONED_SERIALIZE(ASSET_DESCRIPTOR_BASE_LAST_VER, version)
      FIELD(total_max_supply)
      FIELD(current_supply)
      FIELD(decimal_point)
      FIELD(ticker)
      FIELD(full_name)
      FIELD(meta_info)
      FIELD(owner)
      FIELD(hidden_supply)
      END_VERSION_UNDER(1)
      FIELD(owner_eth_pub_key)
      END_VERSION_UNDER(2)
      FIELD(etc)
    END_SERIALIZE()

    BOOST_SERIALIZATION_CURRENT_ARCHIVE_VER(2)
    BEGIN_BOOST_SERIALIZATION()
      BOOST_SERIALIZE(total_max_supply)
      BOOST_SERIALIZE(current_supply)
      BOOST_SERIALIZE(decimal_point)
      BOOST_SERIALIZE(ticker)
      BOOST_SERIALIZE(full_name)
      BOOST_SERIALIZE(meta_info)
      BOOST_SERIALIZE(owner)
      BOOST_SERIALIZE(hidden_supply)
      BOOST_END_VERSION_UNDER(1)
      BOOST_SERIALIZE(owner_eth_pub_key)
      BOOST_END_VERSION_UNDER(2)
      BOOST_SERIALIZE(etc)
      BOOST_SERIALIZE(version)
    END_BOOST_SERIALIZATION_TOTAL_FIELDS(11)

    BEGIN_KV_SERIALIZE_MAP()
      KV_SERIALIZE(total_max_supply)  DOC_DSCR("Maximum possible supply for a given asset, cannot be changed after deployment.") DOC_EXMP(1000000000000000000)   DOC_END
      KV_SERIALIZE(current_supply)    DOC_DSCR("Currently emitted supply for the given asset (ignored for REGISTER operation).") DOC_EXMP(500000000000000000)    DOC_END
      KV_SERIALIZE(decimal_point)     DOC_DSCR("Decimal point.")                      DOC_EXMP(12)                        DOC_END
      KV_SERIALIZE(ticker)            DOC_DSCR("Ticker associated with the asset.")   DOC_EXMP("ZABC")                    DOC_END
      KV_SERIALIZE(full_name)         DOC_DSCR("Full name of the asset.")             DOC_EXMP("Zano wrapped ABC")        DOC_END
      KV_SERIALIZE(meta_info)         DOC_DSCR("Any other information associated with the asset, by default in a json format.")           DOC_EXMP("{ \"some_arbitrary_field_name\": \"some arbitrary value\"}")      DOC_END
      KV_SERIALIZE_POD_AS_HEX_STRING(owner) DOC_DSCR("Owner's key, used only for EMIT and UPDATE validation, can be changed by transferring asset ownership.")   DOC_EXMP("f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8")        DOC_END
      KV_SERIALIZE(hidden_supply)     DOC_DSCR("This field is reserved for future use and will be documented later.") DOC_END
      KV_SERIALIZE_POD_AS_HEX_STRING(owner_eth_pub_key) DOC_DSCR("[Optional] Owner's key in the case when ETH signature is used.") DOC_END
    END_KV_SERIALIZE_MAP()
  };
```
The Zano project relies on three distinct serialization mechanisms, each chosen for the layer of the system in which it excels. This document explains why Zano employs three distinct serialization methods and clarifies the specific purpose of each one.

## 1  Deterministic Serialization

**Deterministic serialization lies at the heart of the blockchain core.** (starts from BEGIN_VERSIONED_SERIALIZE) Every cryptographic object — whether it is a transaction, a block header or any other structures that is a part of currency protocol — is encoded with this method. The defining guarantee is simple yet crucial: if a structure is read from a byte buffer and immediately written back, the second buffer will be **bit‑for‑bit identical** to the first, regardless of the binary or software version that performed the operation. Because of this property, cryptographic hashes computed over the data remain stable across platforms and releases, ensuring consensus integrity.

Although the implementation borrows the conceptual pattern of *Boost.Serialization*, it deliberately supports only the handful of C++ types actually used inside Zano. This focused scope keeps the code compact, so serializing a block or transaction is quite fast. The very same serialization is also used by the on‑disk database, due to it's performance properties compared to boost serialization.

A small, developer‑friendly addition is a **one‑way JSON exporter**. When debugging, an object can be dumped to formatted JSON for human inspection. The reverse operation (JSON → object) is intentionally not supported, preserving the deterministic path.

## 2  Key–Value Serialization

**Key–value serialization powers all network protocols in Zano and the wider CryptoNote family.**(starts from BEGIN_KV_SERIALIZE_MAP) Its design revolves around a two‑stage pipeline. First, a C++ object is unpacked into an intermediate key–value store where every field is addressed by name. Only then is the store linearized into a byte stream for transport. The reverse path—byte stream → store → C++ object—follows the same steps in reverse order.

This indirection pays dividends in compatibility. When a newer release introduces an extra field, older nodes simply skip the unfamiliar key during deserialization, while newer nodes treat missing keys as default values. Thanks to this behaviour, **forward and backward compatibility come for free**, without version gates or special‑case code.

Because the store is already structured as named fields, it can be re‑encoded not only as a compact binary blob but also as **JSON or XML**. The JSON form is what enables the wallet’s JSON‑RPC interface: wallet and daemon exchange ordinary HTTP messages containing JSON that mirrors their internal C++ structures, yet both sides enjoy compile‑time type safety.

## 3  Boost Serialization

The third and final mechanism is the well‑known **Boost.Serialization** library.(starts from BEGIN_BOOST_SERIALIZATION) It is neither trimmed nor specialized; it remains precisely because it can **handle virtually any C++ type**, including sophisticated containers such as `boost::variant` and `boost::any`. Zano employs this flexibility where it matters most: when the wallet needs to persist its entire state to disk. The wallet’s object graph is complex and evolves frequently, and Boost.Serialization allows developers to extend it with minimal boilerplate while preserving backward compatibility of the saved files.

## Putting It All Together

**Each serializer lives where it provides the most benefit.** Deterministic serialization gives the blockchain core the immutability it requires; key–value serialization lets network messages and RPC calls evolve gracefully; Boost.Serialization offers a pragmatic solution for persisting wallet state without bespoke code for every data revision. By deploying the right tool at the right layer, Zano balances performance, robustness, and developer ergonomics across the stack.

