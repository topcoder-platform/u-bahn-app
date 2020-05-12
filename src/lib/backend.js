function getProfiles(searchContext) {
    const profiles = [
        {
            id: 1,
            name: 'Angel Mccoy Paris',
            handle: '@mcangel',
            isAvailable: true,
            title: 'Front-end Developer',
            company: 'U-Bahn Internet Services',
            groups: ['Group 1', 'g2', 'Group3'],
            completedProjects: 1,
            rating: 5,
            skills: ['Unity'],
            location: 'Paris',
            achievements: ['C++'],
            attributes: []
        },
        {
            id: 1,
            name: 'Johhny Mnemonic Tesla',
            handle: '@jmnemo',
            isAvailable: true,
            title: 'Front-end Developer',
            company: 'U-Bahn Internet Services',
            groups: ['Group 1', 'g2', 'Group3'],
            completedProjects: 1,
            rating: 5,
            skills: ['Unity'],
            location: 'Paris',
            achievements: ['C++'],
            attributes: []
        },
        {
            id: 2,
            name: 'Brandie Fischer London',
            handle: '@bfisher',
            isAvailable: false,
            title: 'Front-end Developer',
            company: 'U-Bahn Internet Services',
            groups: ['Group 1', 'g2', 'Group 3'],
            completedProjects: 2,
            rating: 12,
            skills: ['.Net', 'API'],
            location: 'London',
            achievements: ['.Net'],
            attributes: []
        },
        {
            id: 3,
            name: 'Georgi Stavrev',
            handle: '@mcangel',
            isAvailable: false,
            title: 'Front-end Developer',
            company: 'U-Bahn Internet Services',
            groups: ['Group 1', 'Group 2', 'Group3'],
            completedProjects: 3,
            rating: 112,
            skills: ['Javascript'],
            location: 'Sofia',
            achievements: ['TopCoder', 'Upwork'],
            attributes: []
        },
        {
            id: 4,
            name: 'Peter Petrov',
            handle: '@mcangel',
            isAvailable: true,
            title: 'Front-end Developer',
            company: 'U-Bahn Internet Services',
            groups: ['Group 1', 'g2', 'Group3'],
            completedProjects: 4,
            rating: 4.6,
            skills: [],
            location: 'Sofia',
            achievements: ['TopCoder', 'Informatika'],
            attributes: []
        },
        {
            id: 5,
            name: 'Angel Mccoy',
            handle: '@mcangel',
            isAvailable: true,
            title: 'Front-end Developer',
            company: 'U-Bahn Internet Services',
            groups: ['Group 1', 'g2', 'Group3'],
            completedProjects: 5,
            rating: 1,
            skills: ['EMR'],
            location: 'Sofia',
            achievements: ['Informatika'],
            attributes: []
        }
    ];
    const profilesx4 = profiles.concat(profiles).concat(profiles).concat(profiles);

    const filtered = profilesx4.filter(p => {
        return searchContext.selectedLocations.length === 0
            || searchContext.selectedLocations.includes(p.location);
    }).filter(p => {
        return searchContext.selectedSkills.length === 0
            || searchContext.selectedSkills.filter(value => p.skills.includes(value)).length > 0
    }).filter(p => {
        return searchContext.selectedAchievements.length === 0
            || searchContext.selectedAchievements.filter(value => p.achievements.includes(value)).length > 0
    }).filter(p => {
        if (searchContext.selectedAvailability
            && 'isAvailableSelected' in searchContext.selectedAvailability
            && 'isUnavailableSelected' in searchContext.selectedAvailability) {
            const availabilityFilter = searchContext.selectedAvailability;
            if (availabilityFilter.isAvailableSelected && !availabilityFilter.isUnavailableSelected) {
                return p.isAvailable;
            } else if (!availabilityFilter.isAvailableSelected && availabilityFilter.isUnavailableSelected) {
                return !p.isAvailable;
            }
        }

        return true;
    });

    return filtered;
}

function getLocations() {
    const locationTags = [
        { name: 'New York' },
        { name: 'Paris' },
        { name: 'London' },
        { name: 'Sofia' },
        { name: 'Prague' },
        { name: 'San Francisco' },
        { name: 'Miami' },
        { name: 'Bangalore' },
        { name: 'Amsterdam' },
        { name: 'Colombo' },
        { name: 'Melbourne' }
    ];

    return locationTags;
}

function getSkills() {
    const skillsTags = [
        { name: '.Net' },
        { name: 'API' },
        { name: 'C++' },
        { name: 'React' },
        { name: 'Jekyll' },
        { name: 'Python' },
        { name: 'PHP' },
        { name: 'Rust' },
        { name: 'Angular' },
        { name: 'Java' },
        { name: 'Vue' },
        { name: 'Gatsby' },
        { name: 'Swift' },
        { name: 'C#' },
        { name: 'Javascript' },
        { name: 'Node' },
        { name: 'AWS' },
        { name: 'Unity' }
    ];

    return skillsTags;
}

function getAchievements() {
    const achievementsTags = [
        { name: 'Informatika' },
        { name: 'Upwork' },
        { name: 'TopCoder' }
    ];

    return achievementsTags;
}

function getMyGroups() {
    return [
        { name: 'Group 1', count: 42 },
        { name: 'Group 2', count: 42 },
        { name: 'Group 3', count: 42 }
    ];
}

function getGroups() {
    return [
        { name: 'C++ Developers', count: 42 },
        { name: 'Java Developers', count: 42 },
        { name: 'AWS Experts', count: 42 },
        { name: 'South East Region', count: 42 }
    ];
}

const updateProfile = profile => {
    return profile;
}

export default {
    updateProfile,
    getProfiles,
    getLocations,
    getSkills,
    getAchievements,
    getGroups,
    getMyGroups
}