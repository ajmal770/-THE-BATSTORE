import React, { useState, useEffect, useRef } from 'react';
import { Phone, ChevronDown, X, Check } from 'lucide-react';

export interface CountryCodeOption {
  code: string;
  name: string;
  dialCode: string;
  placeholder: string;
  maxLength: number;
}

const COUNTRY_OPTIONS: CountryCodeOption[] = [
  { code: 'IN', name: 'India', dialCode: '+91', placeholder: '97689 56423', maxLength: 10 },
  { code: 'US', name: 'United States', dialCode: '+1', placeholder: '202 555 0192', maxLength: 10 },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', placeholder: '7911 123456', maxLength: 10 },
  { code: 'AE', name: 'UAE', dialCode: '+971', placeholder: '50 123 4567', maxLength: 9 },
  { code: 'CA', name: 'Canada', dialCode: '+1', placeholder: '416 555 0199', maxLength: 10 },
  { code: 'AU', name: 'Australia', dialCode: '+61', placeholder: '412 345 678', maxLength: 9 },
  { code: 'SG', name: 'Singapore', dialCode: '+65', placeholder: '8123 4567', maxLength: 8 },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', placeholder: '50 123 4567', maxLength: 9 },
  { code: 'QA', name: 'Qatar', dialCode: '+974', placeholder: '3312 3456', maxLength: 8 },
  { code: 'KW', name: 'Kuwait', dialCode: '+965', placeholder: '9123 4567', maxLength: 8 },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', placeholder: '1712 345678', maxLength: 10 },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', placeholder: '300 1234567', maxLength: 10 },
  { code: 'DE', name: 'Germany', dialCode: '+49', placeholder: '151 1234567', maxLength: 11 },
  { code: 'FR', name: 'France', dialCode: '+33', placeholder: '6 12 34 56 78', maxLength: 9 },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', placeholder: '12 345 6789', maxLength: 10 },
  { code: 'JP', name: 'Japan', dialCode: '+81', placeholder: '90 1234 5678', maxLength: 10 },
  { code: 'BR', name: 'Brazil', dialCode: '+55', placeholder: '11 98765 4321', maxLength: 11 },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', placeholder: '82 123 4567', maxLength: 9 },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', placeholder: '21 123 4567', maxLength: 9 },
  { code: 'ES', name: 'Spain', dialCode: '+34', placeholder: '612 34 56 78', maxLength: 9 },
  { code: 'IT', name: 'Italy', dialCode: '+39', placeholder: '320 123 4567', maxLength: 10 },
];

export interface PhoneInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  helperText?: string;
  placement?: 'top' | 'bottom' | 'auto';
}

export const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  value,
  onChange,
  label = 'Phone Number',
  helperText,
  placement = 'auto',
}) => {
  const parsePhoneValue = (val: string) => {
    if (!val) return { country: COUNTRY_OPTIONS[0], digits: '' };
    const trimmed = val.trim();
    if (trimmed.startsWith('+')) {
      const sorted = [...COUNTRY_OPTIONS].sort((a, b) => b.dialCode.length - a.dialCode.length);
      for (const country of sorted) {
        if (trimmed.startsWith(country.dialCode)) {
          const rawDigits = trimmed.slice(country.dialCode.length).replace(/\D/g, '');
          return { country, digits: rawDigits.slice(0, country.maxLength) };
        }
      }
    }
    const digitsOnly = trimmed.replace(/\D/g, '');
    return { country: COUNTRY_OPTIONS[0], digits: digitsOnly.slice(0, COUNTRY_OPTIONS[0].maxLength) };
  };

  const initialParsed = parsePhoneValue(value);
  const [selectedCountry, setSelectedCountry] = useState<CountryCodeOption>(initialParsed.country);
  const [digits, setDigits] = useState<string>(initialParsed.digits);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value) {
      setDigits('');
      return;
    }
    const parsed = parsePhoneValue(value);
    if (value.trim().startsWith('+')) {
      setSelectedCountry(parsed.country);
    }
    setDigits(parsed.digits);
  }, [value]);

  const [openUpward, setOpenUpward] = useState(placement === 'top');

  useEffect(() => {
    if (placement === 'top') {
      setOpenUpward(true);
      return;
    }
    if (placement === 'bottom') {
      setOpenUpward(false);
      return;
    }
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const parentCard = dropdownRef.current.closest<HTMLElement>('.rounded-3xl, .bg-white, section');
      const spaceToBottom = parentCard
        ? parentCard.getBoundingClientRect().bottom - rect.bottom
        : window.innerHeight - rect.bottom;
      setOpenUpward(spaceToBottom < 210);
    }
  }, [isOpen, placement]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleDigitsChange = (newRawDigits: string) => {
    const cleanDigits = newRawDigits.replace(/\D/g, '').slice(0, selectedCountry.maxLength);
    setDigits(cleanDigits);
    if (cleanDigits) {
      onChange(`${selectedCountry.dialCode} ${cleanDigits}`);
    } else {
      onChange('');
    }
  };

  const handleSelectCountry = (country: CountryCodeOption) => {
    setSelectedCountry(country);
    setIsOpen(false);
    const trimmedDigits = digits ? digits.slice(0, country.maxLength) : '';
    setDigits(trimmedDigits);
    if (trimmedDigits) {
      onChange(`${country.dialCode} ${trimmedDigits}`);
    } else {
      onChange('');
    }
  };

  const handleClear = () => {
    setDigits('');
    onChange('');
  };

  return (
    <div className="space-y-2" ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
          {label}
        </label>
      )}

      {/* Input Group with Country Selector & Phone Input */}
      <div className="relative">
        <div className="flex items-center bg-gray-50/40 border border-gray-300 rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-sapphire/20 focus-within:border-sapphire transition-all duration-200 hover:border-gray-400 group">
          {/* Country Selector Button showing Flag + Dial Code */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 pl-3 pr-2.5 py-2.5 bg-gray-50/90 hover:bg-gray-100 text-gray-800 rounded-l-xl transition-colors cursor-pointer border-r border-gray-200 shrink-0 outline-none"
            title={`${selectedCountry.name} (${selectedCountry.dialCode})`}
          >
            {/* Flag Image */}
            <img
              src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
              alt={selectedCountry.code}
              style={{ width: '20px', height: '14px' }}
              className="object-cover rounded-[2px] border border-gray-300/80 shrink-0 select-none pointer-events-none"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />

            {/* Dial Code (+91, +1, +44, etc.) */}
            <span className="font-extrabold text-gray-900 tracking-tight text-xs sm:text-sm">
              {selectedCountry.dialCode}
            </span>

            <ChevronDown
              size={13}
              className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-sapphire' : ''}`}
            />
          </button>

          {/* Tel Input with Phone Icon */}
          <div className="relative flex-1 flex items-center">
            <Phone size={15} className="absolute left-3 text-gray-400 pointer-events-none group-focus-within:text-sapphire transition-colors shrink-0" />
            <input
              type="tel"
              inputMode="numeric"
              placeholder={selectedCountry.placeholder}
              value={digits}
              onChange={(e) => handleDigitsChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-transparent border-none outline-none font-semibold text-gray-900 text-xs sm:text-sm placeholder:text-gray-400 tracking-wide"
            />
            {digits && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200/60 rounded-full transition-colors cursor-pointer border-none bg-transparent"
                title="Clear number"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Compact Dropdown with decreased width matching the button */}
        {isOpen && (
          <div
            className={`absolute left-0 ${
              openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
            } w-28 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden`}
          >
            <div className="max-h-48 overflow-y-auto divide-y divide-gray-50 p-1">
              {COUNTRY_OPTIONS.map((country) => {
                const isSelected = country.code === selectedCountry.code;
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleSelectCountry(country)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer border-none ${
                      isSelected
                        ? 'bg-blue-50 text-sapphire font-bold'
                        : 'hover:bg-gray-50 text-gray-700 font-medium bg-transparent'
                    }`}
                    title={`${country.name} (${country.dialCode})`}
                  >
                    <div className="flex items-center gap-1.5">
                      <img
                        src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                        alt={country.name}
                        style={{ width: '18px', height: '12px' }}
                        className="object-cover rounded-[2px] border border-gray-300/80 shrink-0 select-none pointer-events-none"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="font-extrabold text-gray-900 text-xs tracking-tight">
                        {country.dialCode}
                      </span>
                    </div>
                    {isSelected && (
                      <Check size={12} className="text-sapphire shrink-0 stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Helper text */}
      {helperText && (
        <p className="text-[11px] text-gray-400 font-medium pt-0.5">
          {helperText}
        </p>
      )}
    </div>
  );
};
