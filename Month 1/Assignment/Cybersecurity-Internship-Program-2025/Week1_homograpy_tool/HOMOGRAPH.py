# -*- coding: utf-8 -*-

def demonstrate_homograph_attack():
    """
    This function demonstrates a homograph attack by creating a fake domain
    that looks identical to a legitimate one using Unicode characters.
    """

    # --- Step 1: Define the Legitimate and Malicious Domains ---

    # The legitimate domain we want to impersonate.
    # All characters are from the standard Latin alphabet.
    legitimate_domain = "google.com"

    # The malicious homograph domain.
    # We replace the Latin 'o' (U+006F) with the Cyrillic 'о' (U+043E).
    # To the human eye, they are indistinguishable.
    # We use the Unicode escape sequence for the Cyrillic 'о'.
    homograph_domain = "go\u043egle.com"


    # --- Step 2: Display the Domains to Show Visual Similarity ---

    print("--- Homograph Attack Demonstration ---")
    print(f"Legitimate Domain:  {legitimate_domain}")
    print(f"Malicious Domain:   {homograph_domain}")
    print("-" * 38)


    # --- Step 3: Prove the Domains are Different for the Computer ---

    print("\nVerifying if the domains are the same...")
    if legitimate_domain == homograph_domain:
        print("Result: The domains are identical.")
    else:
        print("Result: The domains are DIFFERENT.")
        print("This is because they use characters from different Unicode blocks.")
    print("-" * 38)


    # --- Step 4: Show the Punycode Equivalent ---

    # Browsers and DNS systems cannot handle Unicode characters directly.
    # They use an encoding called "Punycode" to represent them using only ASCII characters.
    # An attacker would register the Punycode version of the domain.
    # A Punycode domain always starts with "xn--".

    print("\nConverting the malicious domain to Punycode...")
    # We first encode the string to utf-8, then to punycode
    punycode_domain = homograph_domain.encode('punycode').decode('utf-8')

    print(f"The Punycode version of '{homograph_domain}' is: {punycode_domain}")
    print("An attacker would register this 'xn--' domain.")
    print("-" * 38)


    # --- Step 5: Simulate a Browser's Address Bar ---

    print("\nHow modern browsers mitigate this attack:")
    print("If a domain contains mixed-scripts (e.g., Latin and Cyrillic),")
    print("the browser will display the Punycode version to warn the user.")
    print(f"\nYour browser's address bar would show: https://{punycode_domain}")


if __name__ == "__main__":
    demonstrate_homograph_attack()

