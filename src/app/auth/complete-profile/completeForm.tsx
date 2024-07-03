"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import debounce from 'lodash/debounce';
import { completeAccount } from "~/server/actions/auth";
import { SearchDropdown } from "~/components/ui/search-dropdown";
import { LabeledInput, LabelInputContainer } from "~/components/ui/labeled-input";
import {Country, University, Major, AccountData } from "~/types/profiles";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "~/components/ui/select";

import { commonMajors } from '~/data/majorData';

const FlowerSelection: React.FC<{ onSelect: (flowerNumber: number) => void }> = ({ onSelect }) => {
  return (
    <div className="flex flex-col gap-8">
      <p className="mt-4 text-sm text-gray-500 text-start">Last thing I promise...</p>
      <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 md:mb-8">Which flower is more "you"?</h2>
      <div className="flex justify-center space-x-4">
        {[1, 2, 3, 4].map((flowerNumber) => (
          <button
            key={flowerNumber}
            onClick={() => onSelect(flowerNumber)}
            className="w-28 h-28 bg-gray-200 rounded-lg overflow-hidden hover:opacity-75 transition-opacity"
          >
            <img src={`/flowers/${flowerNumber}/lvl6.png`} alt={`Flower ${flowerNumber}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-500 text-end">Choose wisely u will be stuck with this ;)</p>
    </div>
  );
};

export function CompleteForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<AccountData>({
    memberType: "member",
    firstName: "",
    lastName: "",
    country: "",
    university: "",
    major: "",
    schoolYear: "",
    discordUsername: "",
    githubUrl: "",
    linkedinUrl: "",
    personalWebsite: "",
    flowerProfile: "",
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [majors] = useState(commonMajors);
  const [error, setError] = useState<string | null>(null);
  const [flowerSelectionStep, setFlowerSelectionStep] = useState(false);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchUniversities = async (country: string, search: string) => {
    try {
      const response = await fetch(`http://universities.hipolabs.com/search?country=${country}&name=${search}`);
      const data = await response.json();
      setUniversities(data);
    } catch (error) {
      console.error("Error fetching universities:", error);
    }
  };

  const debouncedFetchUniversities = debounce(fetchUniversities, 300);

  const handleChange = (name: keyof AccountData, value: string) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));

    if (name === 'country') {
      setFormData(prevData => ({ ...prevData, university: '' }));
    } else if (name === 'university') {
      if (formData.country && value) {
        debouncedFetchUniversities(formData.country, value);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFlowerSelectionStep(true);
  };

  const handleFlowerSelection = async (flowerNumber: number) => {
    const updatedFormData = { ...formData, flowerProfile: `flowers/${flowerNumber}/lvl1.png` };
    const res = await completeAccount(updatedFormData);
    if (res) {
      toast.error('Error completing profile', {
        duration: 4000,
        position: 'bottom-right',
        style: {
          border: '2px solid #333',
          color: '#fff',
          backgroundColor: '#333',
        },
      });
      setError(res);
    } else {
      toast.success('Profile completed successfully', {
        duration: 4000,
        position: 'bottom-right',
        style: {
          border: '2px solid #333',
          color: '#fff',
          backgroundColor: '#333',
        },
      });
      router.push('/');
    }
  };

  return (
    <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl w-full mx-auto rounded-xl sm:rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 pt-20 sm:pt-48 md:pt-52 lg:pt-52 text-white">
      {!flowerSelectionStep ? (
        <>
          <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 md:mb-8">Welcome to MSU AI Club</h2>
          <p className="text-neutral-400 text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
            Please fill out all the information below.
          </p>

          {error && <p className="text-red-500 pb-8">{error}</p>}

          <form className="space-y-4 sm:space-y-5 md:space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
              <LabeledInput
                label="First name"
                id="firstName"
                name="firstName"
                placeholder="Aidan"
                value={formData.firstName}
                onChange={(value) => handleChange("firstName", value)}
              />
              <LabeledInput
                label="Last name"
                id="lastName"
                name="lastName"
                placeholder="Alsaikhusain"
                value={formData.lastName}
                onChange={(value) => handleChange("lastName", value)}
              />
            </div>

            <SearchDropdown<Country>
              label="Country"
              options={countries}
              value={formData.country}
              onChange={(value) => handleChange("country", value)}
              placeholder="Search and select country"
              getOptionLabel={(country) => country.name.common}
            />

            <SearchDropdown<University>
              label="University"
              options={universities}
              value={formData.university}
              onChange={(value) => handleChange("university", value)}
              placeholder="Search and select university"
              getOptionLabel={(university) => university.name}
              disabled={!formData.country}
            />

            <SearchDropdown<Major>
              label="Major"
              options={majors}
              value={formData.major}
              onChange={(value) => handleChange("major", value)}
              placeholder="Search and select major"
              getOptionLabel={(major) => major.name}
            />
              
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
              <LabelInputContainer>
                <label htmlFor="schoolYear" className="text-base sm:text-lg">School year</label>
                <Select onValueChange={(value) => handleChange("schoolYear", value)}>
                  <SelectTrigger className="w-full h-10 sm:h-12 bg-secondary md:h-14 text-base sm:text-lg">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="freshman">Freshman</SelectItem>
                    <SelectItem value="sophomore">Sophomore</SelectItem>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                  </SelectContent>
                </Select>
              </LabelInputContainer>

              <LabeledInput
                label="Discord username"
                id="discordUsername"
                name="discordUsername"
                placeholder="malshaik"
                value={formData.discordUsername}
                onChange={(value) => handleChange("discordUsername", value)}
              />
            </div>

            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 sm:my-12 md:my-16 h-[1px] sm:h-[2px] w-full" />

            <LabeledInput
              label="Github URL"
              id="githubUrl"
              name="githubUrl"
              placeholder="github.com/malshaik"
              value={formData.githubUrl}
              onChange={(value) => handleChange("githubUrl", value)}
              type="url"
            />

            <LabeledInput
              label="LinkedIn"
              id="linkedinUrl"
              name="linkedinUrl"
              placeholder="linkedin.com/in/malshaik/"
              value={formData.linkedinUrl}
              onChange={(value) => handleChange("linkedinUrl", value)}
              type="url"
            />

            <LabeledInput
              label="Personal website"
              id="personalWebsite"
              name="personalWebsite"
              placeholder="malshaik.com"
              value={formData.personalWebsite}
              onChange={(value) => handleChange("personalWebsite", value)}
              type="url"
            />

            <button
              className="bg-gradient-to-br relative group/btn from-white to-neutral-100 block w-full text-black rounded-md h-12 text-lg sm:text-xl font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] mt-10 sm:mt-16"
              type="submit"
            >
              submit &rarr;
              <BottomGradient />
            </button>
          </form>
        </>
      ) : (
        <FlowerSelection onSelect={handleFlowerSelection} />
      )}
    </div>
  );
}

const BottomGradient: React.FC = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};
