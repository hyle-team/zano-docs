---
sidebar_position: 9
---

# Password Specification

This specification defines the requirements for passwords within the Zano ecosystem to
ensure cross-platform compatibility and security.

## 1. Character Set Requirements

To avoid encoding issues (such as NFC/NFD normalization conflicts) and ensure seamless
migration between mobile and desktop, we use the standard ASCII printable character set.

Allowed Characters:
- Latin Alphabet: A-Z, a-z
- Digits: 0-9
- Special Characters: ~ ! ? @ # $ % ^ & * _ + | { } [ ] ( ) < > : ; " ' - = / . ,

Unified Regular Expression:

```/^[A-Za-z0-9~!?@#$%^&*_+|{}[\]()<>:;"'\-=/.,]*$/```

## 2. Length Constraints

Length requirements depend on the specific use case:

| Password Type        | Min Length | Recommended Length | Max Length |
| -------------------- | ---------- | ------------------ | ---------- |
| Wallet File Password |      8     |         15         |    256     |
| Seed Passphrase      |      8     |         15         |    256     |
| Master Password      |      8     |         15         |    256     |
| PIN code             |      4     |          6         |      8     |

PIN code may be set up to access master password stored in hardware secure storage.

## 3. Validation Logic

To prevent the "lock-out" scenario the following logic must be implemented:

- __[New Password Creation]__ Must strictly adhere to the regex and length limits.
- __[Existing Password Entry (Login/Unlock)]__ The UI must not block input. If a user has an old password that doesn't meet the new standard, they must still be able to enter it.
- __[Password Change/Reset]__ The new password must follow the standard. The current password field should not be constraint.
- __[All cases]__ Password should not be truncated in any way.
- __[Existing Password Entry (Login/Unlock)]__ Pasting passwords should be supported, as well as autocomplete from system defined password manager.
- __[New Password Creation]__ Password creation assist from system defined password manager must be supported.
