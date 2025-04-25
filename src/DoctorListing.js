import React, { useState, useEffect } from 'react';

const DoctorListing = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [filters, setFilters] = useState({
        consultation: '',
        specialties: [],
        sort: ''
    });
    const [specialtySearchTerm, setSpecialtySearchTerm] = useState(''); // New state for specialty search
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json')
            .then(response => response.json())
            .then(data => {
                const normalizedData = data.map(doctor => ({
                    ...doctor,
                    speciality: doctor.specialities.map(s => s.name),
                    consultation_type: [
                        doctor.video_consult ? 'Video Consult' : '',
                        doctor.in_clinic ? 'In Clinic' : ''
                    ].filter(Boolean),
                    clinic: doctor.clinics && doctor.clinics.length > 0 ? doctor.clinics[0].name : 'Unknown Clinic'
                }));
                setDoctors(normalizedData);
                setFilteredDoctors(normalizedData);
            })
            .catch(err => {
                setError('Failed to fetch doctors data');
                console.error(err);
            });
    }, []);

    // Initialize filters and search term from URL on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const newFilters = {
            consultation: params.get('consultation') || '',
            specialties: params.get('specialties')?.split(',')?.filter(s => s) || [],
            sort: params.get('sort') || ''
        };
        const initialSearchTerm = params.get('search') || '';
        setFilters(newFilters);
        setSearchTerm(initialSearchTerm);
        applyFilters(newFilters, initialSearchTerm);
    }, [doctors]);

    // Update URL when filters or search term change
    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.consultation) params.set('consultation', filters.consultation);
        if (filters.specialties.length) params.set('specialties', filters.specialties.join(','));
        if (filters.sort) params.set('sort', filters.sort);
        if (searchTerm) params.set('search', searchTerm);
        window.history.pushState({}, '', `?${params.toString()}`);
    }, [filters, searchTerm]);

    // Handle browser navigation (Back/Forward)
    useEffect(() => {
        const handlePopState = () => {
            const params = new URLSearchParams(window.location.search);
            const newFilters = {
                consultation: params.get('consultation') || '',
                specialties: params.get('specialties')?.split(',')?.filter(s => s) || [],
                sort: params.get('sort') || ''
            };
            const newSearchTerm = params.get('search') || '';
            setFilters(newFilters);
            setSearchTerm(newSearchTerm);
            applyFilters(newFilters, newSearchTerm);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [doctors]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term) {
            const matches = doctors
                .filter(d => d.name.toLowerCase().includes(term.toLowerCase()))
                .slice(0, 3);
            setSuggestions(matches);
        } else {
            setSuggestions([]);
        }
        applyFilters(filters, term);
    };

    const applyFilters = (currentFilters, term) => {
        let result = [...doctors];

        if (term) {
            result = result.filter(d => 
                d.name.toLowerCase().includes(term.toLowerCase())
            );
        }

        if (currentFilters.consultation) {
            result = result.filter(d => 
                d.consultation_type.includes(currentFilters.consultation)
            );
        }

        if (currentFilters.specialties.length > 0) {
            result = result.filter(d => 
                currentFilters.specialties.some(s => d.speciality.includes(s))
            );
        }

        if (currentFilters.sort) {
            result.sort((a, b) => {
                if (currentFilters.sort === 'fees') {
                    return parseInt(a.fees.replace('₹ ', '')) - parseInt(b.fees.replace('₹ ', ''));
                } else if (currentFilters.sort === 'experience') {
                    return parseInt(b.experience) - parseInt(a.experience);
                }
                return 0;
            });
        }

        setFilteredDoctors(result);
    };

    const handleFilterChange = (type, value) => {
        const newFilters = { ...filters };
        if (type === 'consultation') {
            newFilters.consultation = value;
        } else if (type === 'specialties') {
            if (newFilters.specialties.includes(value)) {
                newFilters.specialties = newFilters.specialties.filter(s => s !== value);
            } else {
                newFilters.specialties.push(value);
            }
        } else if (type === 'sort') {
            newFilters.sort = value;
        }
        setFilters(newFilters);
        applyFilters(newFilters, searchTerm);
    };

    const clearFilters = () => {
        const newFilters = {
            consultation: '',
            specialties: [],
            sort: ''
        };
        setFilters(newFilters);
        setSearchTerm('');
        setSpecialtySearchTerm(''); // Clear specialty search term
        setSuggestions([]);
        applyFilters(newFilters, '');
    };

    // Filter specialties based on search term
    const allSpecialties = [...new Set(doctors.flatMap(d => d.speciality))];
    const filteredSpecialties = allSpecialties.filter(specialty =>
        specialty.toLowerCase().includes(specialtySearchTerm.toLowerCase())
    );

    if (error) {
        return (
            <div className="text-red-500 p-4 text-center text-lg">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
            {/* Search Bar Section */}
            <div className="mb-6 bg-blue-500 rounded-lg p-4 shadow-md">
                <div className="relative">
                    <input
                        data-testid="autocomplete-input"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search Symptoms, Doctors, Specialities, Clinics"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-300 text-gray-700 placeholder-gray-400 bg-white shadow-sm"
                        aria-label="Search doctors"
                    />
                    <svg
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                {suggestions.length > 0 && (
                    <div className="absolute w-full max-w-[calc(100%-2rem)] bg-white border border-gray-300 rounded-lg mt-1 z-10 shadow-md">
                        {suggestions.map((doctor) => (
                            <div
                                key={doctor.id}
                                data-testid="suggestion-item"
                                className="p-3 hover:bg-blue-50 cursor-pointer flex items-center gap-2"
                                onClick={() => {
                                    setSearchTerm(doctor.name);
                                    setSuggestions([]);
                                    applyFilters(filters, doctor.name);
                                }}
                            >
                                <img
                                    src={doctor.photo}
                                    alt={doctor.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/32';
                                    }}
                                />
                                <div>
                                    <p className="text-gray-800">{doctor.name}</p>
                                    <p className="text-gray-500 text-sm">{doctor.speciality.join(', ')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Main Layout */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Filter Panel */}
                <div className="md:w-1/4 w-full">
                    <div className="bg-blue-50 rounded-lg shadow-sm p-4">
                        {/* Sort Options */}
                        <div className="mb-6">
                            <h3 className="font-medium text-blue-600 mb-2">Sort by</h3>
                            <div className="space-y-2">
                                {[
                                    { label: 'Price: Low-High', value: 'fees', testId: 'sort-fees' },
                                    { label: 'Experience: Most Experienced First', value: 'experience', testId: 'sort-experience' }
                                ].map(sort => (
                                    <label key={sort.value} className="flex items-center cursor-pointer">
                                        <input
                                            data-testid={sort.testId}
                                            type="radio"
                                            name="sort"
                                            checked={filters.sort === sort.value}
                                            onChange={() => handleFilterChange('sort', sort.value)}
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            aria-label={`Sort by ${sort.label}`}
                                        />
                                        <span className={`ml-2 text-sm ${filters.sort === sort.value ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                                            {sort.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-blue-600">Filters</h3>
                            {(filters.consultation || filters.specialties.length > 0 || filters.sort) && (
                                <button
                                    onClick={clearFilters}
                                    className="text-blue-600 text-sm hover:underline"
                                    aria-label="Clear all filters"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>

                        {/* Specialties */}
                        <div className="mb-6">
                            <h4 className="font-medium text-blue-600 mb-2">Specialities</h4>
                            <div className="relative mb-2">
                                <input
                                    type="text"
                                    placeholder="Search Specialities"
                                    value={specialtySearchTerm}
                                    onChange={(e) => setSpecialtySearchTerm(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                                    aria-label="Search specialities"
                                />
                                <svg
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            {filteredSpecialties.length === 0 ? (
                                <p className="text-gray-500 text-sm">No specialties found.</p>
                            ) : (
                                <div className="max-h-40 overflow-y-auto">
                                    {filteredSpecialties.map(specialty => (
                                        <label key={specialty} className="flex items-center mb-2 cursor-pointer">
                                            <input
                                                data-testid={`filter-specialty-${specialty.replace(/[^a-zA-Z]/g, '-')}`}
                                                type="checkbox"
                                                checked={filters.specialties.includes(specialty)}
                                                onChange={() => handleFilterChange('specialties', specialty)}
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                aria-label={`Filter by ${specialty}`}
                                            />
                                            <span className={`ml-2 text-sm capitalize ${filters.specialties.includes(specialty) ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                                                {specialty.toLowerCase()}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mode of Consultation */}
                        <div>
                            <h4 className="font-medium text-blue-600 mb-2">Mode of Consultation</h4>
                            <div className="space-y-2">
                                {['Video Consult', 'In Clinic'].map(type => (
                                    <label key={type} className="flex items-center cursor-pointer">
                                        <input
                                            data-testid={`filter-${type.toLowerCase().replace(' ', '-')}`}
                                            type="radio"
                                            name="consultation"
                                            checked={filters.consultation === type}
                                            onChange={() => handleFilterChange('consultation', type)}
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            aria-label={`Filter by ${type}`}
                                        />
                                        <span className={`ml-2 text-sm ${filters.consultation === type ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                                            {type}
                                        </span>
                                    </label>
                                ))}
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="consultation"
                                        checked={filters.consultation === ''}
                                        onChange={() => handleFilterChange('consultation', '')}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        aria-label="Filter by all consultation modes"
                                    />
                                    <span className={`ml-2 text-sm ${filters.consultation === '' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                                        All
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Doctor List */}
                <div className="md:w-3/4 w-full">
                    {filteredDoctors.length === 0 ? (
                        <p className="text-gray-500 text-center text-lg">No doctors found matching the criteria.</p>
                    ) : (
                        <div className="space-y-4">
                            {filteredDoctors.map(doctor => (
                                <div
                                    key={doctor.id}
                                    data-testid="doctor-card"
                                    className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={doctor.photo}
                                            alt={doctor.name}
                                            className="w-12 h-12 rounded-full object-cover border border-gray-200"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/48';
                                            }}
                                        />
                                        <div>
                                            <h3 data-testid="doctor-name" className="font-semibold text-gray-800">{doctor.name}</h3>
                                            <p data-testid="doctor-specialty" className="text-gray-600 text-sm capitalize">{doctor.speciality.join(', ').toLowerCase()}</p>
                                            <p data-testid="doctor-experience" className="text-gray-600 text-sm">{doctor.experience}</p>
                                            <div className="flex items-center gap-1 text-gray-600 text-sm">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <p>{doctor.clinic}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-800 font-semibold mb-2">{doctor.fees}</p>
                                        <button
                                            className="border border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                                            aria-label={`Book appointment with ${doctor.name}`}
                                        >
                                            Book Appointment
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorListing;