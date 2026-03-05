/* ========================================
   Sample Data — default resume content
   ======================================== */
var SampleData = (function() {
    'use strict';

    function get() {
        return {
            personal: {
                firstName: 'Sarah',
                lastName: 'Chen',
                title: 'Senior Product Designer',
                email: 'sarah.chen@email.com',
                phone: '+1 (415) 555-0142',
                location: 'San Francisco, CA',
                website: 'sarahchen.design',
                linkedin: 'linkedin.com/in/sarahchen',
                summary: 'Product designer with 8 years of experience crafting user-centered digital experiences for B2B SaaS platforms. Led design systems serving 200+ engineers across three product lines. Specialized in complex data visualization and enterprise workflow tools.'
            },
            experience: [
                {
                    company: 'Stripe',
                    role: 'Senior Product Designer',
                    startDate: 'Jan 2021',
                    endDate: 'Present',
                    location: 'San Francisco, CA',
                    description: 'Lead designer for Stripe Dashboard analytics. Redesigned the reporting suite used by 50K+ merchants, improving task completion rate by 34%. Built and maintained a component library of 120+ elements. Collaborated with engineering to ship bi-weekly releases.'
                },
                {
                    company: 'Figma',
                    role: 'Product Designer',
                    startDate: 'Mar 2018',
                    endDate: 'Dec 2020',
                    location: 'San Francisco, CA',
                    description: 'Designed collaborative editing features including multiplayer cursors and commenting. Conducted 40+ user interviews to validate prototypes. Shipped the Variables feature that became central to design token workflows.'
                },
                {
                    company: 'Dropbox',
                    role: 'Junior Designer',
                    startDate: 'Jun 2016',
                    endDate: 'Feb 2018',
                    location: 'San Francisco, CA',
                    description: 'Contributed to the Paper product redesign. Created illustrations and icons for the marketing site. Assisted in building the internal design system documentation.'
                }
            ],
            education: [
                {
                    institution: 'Stanford University',
                    degree: 'M.S. Human-Computer Interaction',
                    startDate: '2014',
                    endDate: '2016',
                    description: 'Focus on interaction design and user research methodology.'
                },
                {
                    institution: 'UC Berkeley',
                    degree: 'B.A. Cognitive Science',
                    startDate: '2010',
                    endDate: '2014',
                    description: 'Minor in Computer Science. Dean\'s List all semesters.'
                }
            ],
            skills: [
                {
                    category: 'Design',
                    items: 'Figma, Sketch, Adobe Creative Suite, Prototyping, Wireframing, Design Systems'
                },
                {
                    category: 'Technical',
                    items: 'HTML, CSS, JavaScript, React basics, Git, Accessibility (WCAG)'
                },
                {
                    category: 'Research',
                    items: 'User Interviews, Usability Testing, A/B Testing, Analytics, Journey Mapping'
                }
            ],
            languages: [
                { language: 'English', proficiency: 'Native' },
                { language: 'Mandarin', proficiency: 'Fluent' },
                { language: 'Spanish', proficiency: 'Conversational' }
            ],
            certifications: [
                { name: 'Google UX Design Professional Certificate', year: '2022' },
                { name: 'Certified Accessibility Professional (CPAC)', year: '2021' }
            ]
        };
    }

    return { get: get };
})();
