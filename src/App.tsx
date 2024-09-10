import React, { useState } from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";
import transformAddress, { RawAddressModel } from "./core/models/address";


function App() {
  const [postCode, setPostCode] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [loading, setLoading] = useState(false);

  const { addAddress } = useAddressBook();

  const handlePostCodeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPostCode(e.target.value);

  const handleHouseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setHouseNumber(e.target.value);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFirstName(e.target.value);

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLastName(e.target.value);

  const handleSelectedAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setSelectedAddress(e.target.value);

  /** Fetch addresses based on houseNumber and postCode */
  const handleAddressSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);  // Clear previous errors
    setAddresses([]);     // Clear previous results
    setLoading(true);     // Set loading state to true while fetching
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=${postCode}&streetnumber=${houseNumber}`
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.errormessage);
        setLoading(false);
        return;
      }
  
      const data = await response.json();
  
      if (data.details && Array.isArray(data.details)) {
        // Only pass the address since houseNumber is part of RawAddressModel
        const transformedAddresses = data.details.map((address: RawAddressModel) =>
          transformAddress(address)  // Pass only the address
        );
        
        setAddresses(transformedAddresses);
      } else {
        setError("No addresses found.");
      }
    } catch (error) {
      setError("Failed to fetch addresses.");
    } finally {
      setLoading(false);
    }
  };
  
  

  /** Validate first name and last name fields */
  const handlePersonSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firstName || !lastName) {
      setError("First name and last name fields mandatory!");
      return;
    }

    if (!selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === selectedAddress
    );

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({ ...foundAddress, firstName, lastName });
    clearAllFields(); // Optional: clear all fields after adding address
  };

  /** Clear all form fields, search results, and errors */
  const clearAllFields = () => {
    setPostCode("");
    setHouseNumber("");
    setFirstName("");
    setLastName("");
    setSelectedAddress("");
    setAddresses([]);
    setError(undefined);
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode, add personal info, and done! 👏
          </small>
        </h1>

        <form onSubmit={handleAddressSubmit}>
          <fieldset>
            <legend>🏠 Find an address</legend>
            <div className={styles.formRow}>
              <InputText
                name="postCode"
                onChange={handlePostCodeChange}
                placeholder="Post Code"
                value={postCode}
              />
            </div>
            <div className={styles.formRow}>
              <InputText
                name="houseNumber"
                onChange={handleHouseNumberChange}
                value={houseNumber}
                placeholder="House number"
              />
            </div>
            <Button type="submit" loading={loading}>
              {loading ? "Loading..." : "Find"}
            </Button>
          </fieldset>
        </form>

        {addresses.length > 0 &&
          addresses.map((address) => (
            <Radio
              name="selectedAddress"
              id={address.id}
              key={address.id}
              onChange={handleSelectedAddressChange}
            >
              <Address {...address} />
            </Radio>
          ))}

        {selectedAddress && (
          <form onSubmit={handlePersonSubmit}>
            <fieldset>
              <legend>✏️ Add personal info to address</legend>
              <div className={styles.formRow}>
                <InputText
                  name="firstName"
                  placeholder="First name"
                  onChange={handleFirstNameChange}
                  value={firstName}
                />
              </div>
              <div className={styles.formRow}>
                <InputText
                  name="lastName"
                  placeholder="Last name"
                  onChange={handleLastNameChange}
                  value={lastName}
                />
              </div>
              <Button type="submit">Add to addressbook</Button>
            </fieldset>
          </form>
        )}

        {error && <ErrorMessage message={error} />}

        <Button variant="secondary" onClick={clearAllFields}>
          Clear all fields
        </Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
