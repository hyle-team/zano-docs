# How to verify downloaded builds

1. Download and install [GnuPG for Windows](https://www.gnupg.org/download/) or [GPGTools for macOS](https://gpgtools.org/). Linux users likely already have gpg installed.

2. Download [Zano Build Signer public key](https://raw.githubusercontent.com/hyle-team/zano/refs/heads/master/utils/gpg/zano_build_signer.asc) from GitHub. You may also check the file history to ensure it hasn't been changed recently (it is normally updated once every 2 years).

3. Open a terminal (command-line console), then:

   3.1. Verify key fingerprint:
   ```
   gpg --keyid-format short --with-fingerprint zano_build_signer.asc
   ```
   You should output similar to this:
   ```
   gpg: WARNING: no command supplied.  Trying to guess what you mean ...
   pub   ed25519/F79F971A 2025-10-20 [SC] [expires: 2027-10-20]
         Key fingerprint = 8095 41D2 C95F 794B 986E  879F A92B 86C2 F79F 971A
   uid                   Zano Build Signer <support@zano.org>
   sub   cv25519/E23B6116 2025-10-20 [E] [expires: 2027-10-20]
   ```
   Make sure the fingerprint is **8095 41D2 C95F 794B 986E  879F A92B 86C2 F79F 971A**, if not — stop right there and remove the key file, don't import it!

   3.2. Import the public key:
   ```
   gpg --import zano_build_signer.asc
   ```

   Now the public key is imported and ready to use.

5. When you want to verify the valitidy of the hashes for build files, copy all the text from `-----BEGIN PGP SIGNED MESSAGE-----` to `-----END PGP SIGNATURE-----` (including the separators) and paste it in a text file, say, `test.txt`.

6. In a terminal run verification:
   ```
   gpg --verify test.txt
   ```

   You should see this:
   ```
   gpg: Signature made 2025-10-20 17:04:47 Central Europe Daylight Time
   gpg:                using EDDSA key 809541D2C95F794B986E879FA92B86C2F79F971A
   gpg: Good signature from "Zano Build Signer <support@zano.org>" [ultimate]
   ```
   Make sure you see "Good signature". Now you can be confident that the hashes and links to the builds are correct.

7. Download the build file using the link from the signed message.

8. Calculate SHA256 checksum of the downloaded file. You can use any SHA256 hash calculator, or the built-in command-line utility:

   On Windows run in terminal:
   ```
   certutils -hashfile <FILENAME>
   ```
   On Linux or macOS:
   ```
   shasum -a 256 <FILENAME>
   ```
   where `<FILENAME>` should be replaced with the filename you've downloaded, for instance:
   ```
   certutils -hashfile zano-win-x64-release-v2.1.10.433[653f8b5].zip SHA256
   ```
   You sould see something like that:
   ```
   SHA256 hash of zano-win-x64-release-v2.1.10.433[653f8b5].zip:
   aad9f31750ef9a49e2019db97587b195dccbaeadaf7c3e16ed51c371d97992a9
   CertUtil: -hashfile command completed successfully.
   ```

   Carefully compare the calculated SHA256 checksum with the one provided. If they don't match — remove the downloaded file!
   
   If they do, you're good to go!
   
