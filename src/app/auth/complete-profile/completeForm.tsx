"use client"

import React, { useState, useEffect, useRef, FormEvent, ChangeEvent, KeyboardEvent } from "react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "~/components/ui/select";
import { cn } from "~/utils/cn";
import { completeAccount } from "~/server/actions/auth";
import { useRouter } from "next/navigation";
import debounce from 'lodash/debounce';
import { toast } from "react-hot-toast";

interface Country {
  name: {
    common: string;
    official: string;
    nativeName: Record<string, { official: string; common: string }>;
  };
}

interface University {
  name: string;
  country: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  country: string;
  university: string;
  major: string;
  schoolYear: string;
  discordUsername: string;
  githubUrl: string;
  linkedinUrl: string;
  personalWebsite: string;
}

interface Major {
  name: string;
}

export function CompleteForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    country: "",
    university: "",
    major: "",
    schoolYear: "",
    discordUsername: "",
    githubUrl: "",
    linkedinUrl: "",
    personalWebsite: ""
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isUniversityDropdownOpen, setIsUniversityDropdownOpen] = useState(false);
  const [isMajorDropdownOpen, setIsMajorDropdownOpen] = useState(false);
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(-1);
  const [selectedUniversityIndex, setSelectedUniversityIndex] = useState(-1);
  const [selectedMajorIndex, setSelectedMajorIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const universityDropdownRef = useRef<HTMLDivElement>(null);
  const majorDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCountries();
    fetchMajors();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
      if (universityDropdownRef.current && !universityDropdownRef.current.contains(event.target as Node)) {
        setIsUniversityDropdownOpen(false);
      }
      if (majorDropdownRef.current && !majorDropdownRef.current.contains(event.target as Node)) {
        setIsMajorDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

  const fetchMajors = async () => {
    // This is a mock function. Replace with actual API call in production.
    const mockMajors = [
      { name: "Computer Science" },
      { name: "Engineering" },
      { name: "Business Administration" },
      { name: "Psychology" },
      { name: "Biology" },
      // ... add more majors as needed
    ];
    setMajors(mockMajors);
  };

  const debouncedFetchUniversities = debounce(fetchUniversities, 300);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));

    if (name === 'country') {
      setIsCountryDropdownOpen(true);
      setSelectedCountryIndex(-1);
    } else if (name === 'university') {
      setIsUniversityDropdownOpen(true);
      setSelectedUniversityIndex(-1);
      if (formData.country && value) {
        debouncedFetchUniversities(formData.country, value);
      }
    } else if (name === 'major') {
      setIsMajorDropdownOpen(true);
      setSelectedMajorIndex(-1);
    }
  };


  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
    if (name === 'country') {
      setFormData(prevData => ({ ...prevData, university: '' }));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, type: 'country' | 'university' | 'major') => {
    let suggestions: any[];
    let setIndex: React.Dispatch<React.SetStateAction<number>>;
    let currentIndex: number;
    let setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;

    switch (type) {
      case 'country':
        suggestions = filteredCountries;
        setIndex = setSelectedCountryIndex;
        currentIndex = selectedCountryIndex;
        setDropdownOpen = setIsCountryDropdownOpen;
        break;
      case 'university':
        suggestions = filteredUniversities;
        setIndex = setSelectedUniversityIndex;
        currentIndex = selectedUniversityIndex;
        setDropdownOpen = setIsUniversityDropdownOpen;
        break;
      case 'major':
        suggestions = filteredMajors;
        setIndex = setSelectedMajorIndex;
        currentIndex = selectedMajorIndex;
        setDropdownOpen = setIsMajorDropdownOpen;
        break;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (currentIndex >= 0 && currentIndex < suggestions.length) {
          const selected = type === 'country' ? suggestions[currentIndex].name.common :
                           type === 'university' ? suggestions[currentIndex].name :
                           suggestions[currentIndex].name;
          handleSelectChange(type, selected);
          setIndex(-1);
          setDropdownOpen(false);
        }
        break;
    }
  };

 const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault();

      const res = await completeAccount(formData);
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
            toast.success('Completed profile', {
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


  const sortCountries = (a: Country, b: Country) => {
    return a.name.common.localeCompare(b.name.common);
  };

  const filteredCountries = countries
    .filter(country => country.name.common.toLowerCase().includes(formData.country.toLowerCase()))
    .sort(sortCountries);

  const filteredUniversities = universities
    .filter(uni => uni.name.toLowerCase().includes(formData.university.toLowerCase()));

  const filteredMajors = majors
      .filter(major => major.name.toLowerCase().includes(formData.major.toLowerCase()));

  return (
    <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl w-full mx-auto rounded-xl sm:rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 pt-20 sm:pt-48 md:pt-52 lg:pt-52 text-white">
      <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 md:mb-8">Welcome to MSU AI Club</h2>
      <p className="text-neutral-400 text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
        pls fill all the info out &lt;3 
      </p>

      {error && 
        <p className="text-red-500 pb-8">{error}</p>
      }

      <form className="space-y-4 sm:space-y-5 md:space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
          <LabelInputContainer>
            <Label htmlFor="firstName" className="text-base sm:text-lg">First name *</Label>
            <Input id="firstName" name="firstName" placeholder="Aidan" type="text" className="h-10 sm:h-12 md:h-14 text-base sm:text-lg" onChange={handleChange} value={formData.firstName} />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastName" className="text-base sm:text-lg">Last name *</Label>
            <Input id="lastName" name="lastName" placeholder="Alsaikhusain" type="text" className="h-10 sm:h-12 md:h-14 text-base sm:text-lg" onChange={handleChange} value={formData.lastName} />
          </LabelInputContainer>
        </div>

        <LabelInputContainer>
          <Label htmlFor="country" className="text-base sm:text-lg">Country</Label>
          <div className="relative" ref={countryDropdownRef}>
            <Input
              id="country"
              name="country"
              placeholder="Search and select country"
              type="text"
              className="h-10 sm:h-12 md:h-14 text-base sm:text-lg"
              onChange={handleChange}
              value={formData.country}
              onFocus={() => setIsCountryDropdownOpen(true)}
              onKeyDown={(e) => handleKeyDown(e, 'country')}
              autoComplete="off"
            />
            {isCountryDropdownOpen && filteredCountries.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-black border rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredCountries.map((country, index) => (
                  <button
                    key={country.name.common}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, country: country.name.common });
                      setIsCountryDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 ${
                      index === selectedCountryIndex ? 'bg-secondary' : 'hover:bg-secondary/70'
                    }`}
                  >
                    {country.name.common}
                  </button>
                ))}
              </div>
            )}
          </div>
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="university" className="text-base sm:text-lg">University</Label>
          <div className="relative" ref={universityDropdownRef}>
            <Input
              id="university"
              name="university"
              placeholder="Search and select university"
              type="text"
              className="h-10 sm:h-12 md:h-14 text-base sm:text-lg"
              onChange={handleChange}
              value={formData.university}
              onFocus={() => setIsUniversityDropdownOpen(true)}
              onKeyDown={(e) => handleKeyDown(e, 'university')}
              disabled={!formData.country}
              autoComplete="off"
            />
            {isUniversityDropdownOpen && filteredUniversities.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-black border  rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredUniversities.map((university, index) => (
                  <button
                    key={university.name}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, university: university.name });
                      setIsUniversityDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 ${
                      index === selectedUniversityIndex ? 'bg-secondary' : 'hover:bg-secondary/70'
                    }`}
                  >
                    {university.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </LabelInputContainer>

              <LabelInputContainer>
        <Label htmlFor="major" className="text-base sm:text-lg">Major</Label>
        <div className="relative" ref={majorDropdownRef}>
          <Input
            id="major"
            name="major"
            placeholder="Search and select major"
            type="text"
            className="h-10 sm:h-12 md:h-14 text-base sm:text-lg"
            onChange={handleChange}
            value={formData.major}
            onFocus={() => setIsMajorDropdownOpen(true)}
            onKeyDown={(e) => handleKeyDown(e, 'major')}
            autoComplete="off"
          />
          {isMajorDropdownOpen && filteredMajors.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-black border rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredMajors.map((major, index) => (
                <button
                  key={major.name}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, major: major.name });
                    setIsMajorDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 ${
                    index === selectedMajorIndex ? 'bg-secondary' : 'hover:bg-secondary/70'
                  }`}
                >
                  {major.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </LabelInputContainer>
        
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
          <LabelInputContainer>
            <Label htmlFor="schoolYear" className="text-base sm:text-lg">School year</Label>
            <Select onValueChange={(value) => handleSelectChange("schoolYear", value)}>
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

          <LabelInputContainer>
            <Label htmlFor="discordUsername" className="text-base sm:text-lg">Discord username</Label>
            <Input id="discordUsername" name="discordUsername" placeholder="malshaik" type="text" className="h-10 sm:h-12 md:h-14 text-base sm:text-lg" onChange={handleChange} value={formData.discordUsername} />
          </LabelInputContainer>
        </div>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 sm:my-12 md:my-16 h-[1px] sm:h-[2px] w-full" />

        <LabelInputContainer>
          <Label htmlFor="githubUrl" className="text-base sm:text-lg">Github URL</Label>
          <Input id="githubUrl" name="githubUrl" placeholder="github.com/malshaik" type="url" className="h-10 sm:h-12 md:h-14 text-base sm:text-lg" onChange={handleChange} value={formData.githubUrl} />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="linkedinUrl" className="text-base sm:text-lg">LinkedIn</Label>
          <Input id="linkedinUrl" name="linkedinUrl" placeholder="linkedin.com/in/malshaik/" type="url" className="h-10 sm:h-12 md:h-14 text-base sm:text-lg" onChange={handleChange} value={formData.linkedinUrl} />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="personalWebsite" className="text-base sm:text-lg">Personal website</Label>
          <Input id="personalWebsite" name="personalWebsite" placeholder="malshaik.com" type="url" className="h-10 sm:h-12 md:h-14 text-base sm:text-lg" onChange={handleChange} value={formData.personalWebsite} />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-white to-neutral-100 block  w-full text-black rounded-md h-12 text-lg sm:text-xl font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]  mt-10 sm:mt-16"
          type="submit"
        >
          submit &rarr;
          <BottomGradient />
        </button>

      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-3 w-full", className)}>
      {children}
    </div>
  );
};
