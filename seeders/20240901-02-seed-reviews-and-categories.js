
// --- 2) REVIEWS (unchanged content, still maps to new properties) ---

// const insertedReviews = await queryInterface.bulkInsert('review', reviews, { returning: true });

'use strict';

import { Op } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    const now = new Date();

    const defaultImages = [
        "https://hostaway-platform.s3.us-west-2.amazonaws.com/listing/23248-410368-bLEiNoNHEtOpcb1uyxkLqyRSHCSDJYunoWsdsKPXnFI-688c83336661f",
        "https://hostaway-platform.s3.us-west-2.amazonaws.com/listing/23248-410368-jQc7bN1InNpn6QJbzyA--mt83P4OjYtiTHLNWdWtHngE-688c83326870e",
        "https://hostaway-platform.s3.us-west-2.amazonaws.com/listing/23248-410368-h4EVtVkaNDTj1BD8iRDjom--8G1cFMirdJy1WPoHuLTM-688c83305c261",
        "https://hostaway-platform.s3.us-west-2.amazonaws.com/listing/23248-410368-xKrni1SXPZWDbWONGa3FypBgNzIumkdXcL4HpHovNdk-688c833463ec5",
    ];

    const baseAmenities = [
        "Cable TV", "Kitchen", "Heating", "Internet", "Washing Machine",
        "Smoke Detector", "Wireless", "Hair Dryer", "Carbon Monoxide Detector"
    ];

    const baseRules = [
        "No smoking", "No pets", "No parties or events", "Security deposit required"
    ];

    const baseCancellation = {
        short_stays: [
            "Full refund up to 14 days before check-in",
            "No refund for bookings less than 14 days before check-in",
        ],
        long_stays: [
            "Full refund up to 30 days before check-in",
            "No refund for bookings less than 30 days before check-in",
        ],
    };

    const properties = [
        {
            name: "Shoreditch Heights – 29",
            hostaway_listing_name: "SH29",
            channel_default: "airbnb",
            slug: "shoreditch-heights-29",
            description:
                "Located in the vibrant and well-connected neighbourhood of Bermondsey, this stylish 1-bedroom flat offers comfortable living with modern finishes. The property features a bright open-plan kitchen and living area, a spacious double bedroom, and a sleek bathroom. Just a short walk from local cafes, restaurants, and transport links.",
            specs: JSON.stringify({ guests: 4, bedrooms: 1, bathrooms: 1, beds: 3, checkin_time: "3:00 PM", checkout_time: "10:00 AM" }),
            amenities: JSON.stringify(baseAmenities),
            house_rules: JSON.stringify(baseRules),
            cancellation_policy: JSON.stringify(baseCancellation),
            location: JSON.stringify({ city: "London", address: "Bermondsey, London", lat: 51.497, lng: -0.08 }),
            images: JSON.stringify(defaultImages),
            created_at: now,
        },
        {
            name: "Canary Wharf Suites – 12",
            hostaway_listing_name: "CWS12",
            channel_default: "booking",
            slug: "canary-wharf-suites-12",
            description:
                "Modern suite in Canary Wharf with floor-to-ceiling windows and riverside vibes. Perfect for business stays with fast Wi-Fi, workspace, and excellent transport links.",
            specs: JSON.stringify({ guests: 4, bedrooms: 1, bathrooms: 1, beds: 2, checkin_time: "3:00 PM", checkout_time: "10:00 AM" }),
            amenities: JSON.stringify(baseAmenities),
            house_rules: JSON.stringify(baseRules),
            cancellation_policy: JSON.stringify(baseCancellation),
            location: JSON.stringify({ city: "London", address: "Canary Wharf, London", lat: 51.505, lng: -0.02 }),
            images: JSON.stringify(defaultImages),
            created_at: now,
        },
        {
            name: "Kensington Place – 7",
            hostaway_listing_name: "KP7",
            channel_default: "google",
            slug: "kensington-place-7",
            description:
                "Elegant apartment in Kensington close to museums and parks. Calm streets, refined interior, and easy access to central London.",
            specs: JSON.stringify({ guests: 3, bedrooms: 1, bathrooms: 1, beds: 2, checkin_time: "3:00 PM", checkout_time: "10:00 AM" }),
            amenities: JSON.stringify(baseAmenities),
            house_rules: JSON.stringify(baseRules),
            cancellation_policy: JSON.stringify(baseCancellation),
            location: JSON.stringify({ city: "London", address: "Kensington, London", lat: 51.499, lng: -0.19 }),
            images: JSON.stringify(defaultImages),
            created_at: now,
        },
    ];

    const insertedProps = await queryInterface.bulkInsert('property', properties, { returning: true });
    const pid = Object.fromEntries((insertedProps ?? []).map(p => [p.name, p.id]));

    const toDate = s => new Date(s);

    // reviews (unchanged)
    const reviews = [
        // 2023 (7)
        { property_id: pid['Shoreditch Heights – 29'], source: 'hostaway', source_review_id: 'HA-4001', type: 'guest-to-host', status: 'published', rating: 4.0, comment: 'Nice summer 2023 trip, cozy apartment.', channel: 'airbnb', submitted_at: toDate('2023-06-14T14:00:00Z'), guest_name: 'Alice Johnson', approved_for_website: true, created_at: toDate('2023-06-15T10:00:00Z') },
        { property_id: pid['Canary Wharf Suites – 12'], source: 'hostaway', source_review_id: 'HA-4002', type: 'guest-to-host', status: 'published', rating: 3.0, comment: 'Great view but noisy construction.', channel: 'booking', submitted_at: toDate('2023-09-05T09:30:00Z'), guest_name: 'Michael Brown', approved_for_website: false, created_at: toDate('2023-09-06T12:00:00Z') },
        { property_id: pid['Kensington Place – 7'], source: 'hostaway', source_review_id: 'HA-4003', type: 'guest-to-host', status: 'published', rating: 5.0, comment: 'Best host ever, fall 2023 stay.', channel: 'google', submitted_at: toDate('2023-10-12T15:45:00Z'), guest_name: 'Emma Davis', approved_for_website: true, created_at: toDate('2023-10-13T11:00:00Z') },
        { property_id: pid['Shoreditch Heights – 29'], source: 'hostaway', source_review_id: 'HA-4004', type: 'guest-to-host', status: 'published', rating: 2.0, comment: 'Heating issues in November.', channel: 'airbnb', submitted_at: toDate('2023-11-18T17:45:00Z'), guest_name: 'Raj Patel', approved_for_website: false, created_at: toDate('2023-11-19T09:30:00Z') },
        { property_id: pid['Canary Wharf Suites – 12'], source: 'hostaway', source_review_id: 'HA-4005', type: 'guest-to-host', status: 'published', rating: 5.0, comment: 'Business trip, excellent WiFi.', channel: 'airbnb', submitted_at: toDate('2023-04-03T20:20:00Z'), guest_name: 'Sophia Wilson', approved_for_website: true, created_at: toDate('2023-04-04T10:00:00Z') },
        { property_id: pid['Kensington Place – 7'], source: 'hostaway', source_review_id: 'HA-4006', type: 'guest-to-host', status: 'published', rating: 4.0, comment: 'Quiet neighborhood, relaxing holiday.', channel: 'google', submitted_at: toDate('2023-07-08T15:00:00Z'), guest_name: 'Daniel Lee', approved_for_website: true, created_at: toDate('2023-07-09T09:00:00Z') },
        { property_id: pid['Shoreditch Heights – 29'], source: 'hostaway', source_review_id: 'HA-4007', type: 'guest-to-host', status: 'published', rating: 1.0, comment: 'Terrible maintenance.', channel: 'booking', submitted_at: toDate('2023-08-21T12:30:00Z'), guest_name: 'Hannah Clark', approved_for_website: false, created_at: toDate('2023-08-22T11:00:00Z') },

        // 2024 (7)
        { property_id: pid['Kensington Place – 7'], source: 'hostaway', source_review_id: 'HA-4008', type: 'guest-to-host', status: 'published', rating: 5.0, comment: 'New Year’s stay was excellent!', channel: 'google', submitted_at: toDate('2024-01-02T10:15:00Z'), guest_name: 'Sarah Adams', approved_for_website: true, created_at: toDate('2024-01-03T08:00:00Z') },
        { property_id: pid['Shoreditch Heights – 29'], source: 'hostaway', source_review_id: 'HA-4009', type: 'guest-to-host', status: 'published', rating: 3.0, comment: 'Heating tricky to use.', channel: 'airbnb', submitted_at: toDate('2024-02-18T17:45:00Z'), guest_name: 'Raj Patel', approved_for_website: false, created_at: toDate('2024-02-19T09:30:00Z') },
        { property_id: pid['Canary Wharf Suites – 12'], source: 'hostaway', source_review_id: 'HA-4010', type: 'guest-to-host', status: 'published', rating: 4.0, comment: 'Stylish place with great amenities.', channel: 'airbnb', submitted_at: toDate('2024-03-12T19:45:00Z'), guest_name: 'Lucas Wright', approved_for_website: true, created_at: toDate('2024-03-13T09:00:00Z') },
        { property_id: pid['Canary Wharf Suites – 12'], source: 'hostaway', source_review_id: 'HA-4011', type: 'guest-to-host', status: 'published', rating: 2.0, comment: 'WiFi was spotty.', channel: 'booking', submitted_at: toDate('2024-05-22T11:20:00Z'), guest_name: 'Zara Khan', approved_for_website: false, created_at: toDate('2024-05-23T10:00:00Z') },
        { property_id: pid['Kensington Place – 7'], source: 'hostaway', source_review_id: 'HA-4012', type: 'guest-to-host', status: 'published', rating: 5.0, comment: 'Best summer getaway!', channel: 'airbnb', submitted_at: toDate('2024-07-05T18:00:00Z'), guest_name: 'Henry Walker', approved_for_website: true, created_at: toDate('2024-07-06T12:00:00Z') },
        { property_id: pid['Shoreditch Heights – 29'], source: 'hostaway', source_review_id: 'HA-4013', type: 'guest-to-host', status: 'published', rating: 4.0, comment: 'Nice decor and spacious rooms.', channel: 'airbnb', submitted_at: toDate('2024-09-08T08:15:00Z'), guest_name: 'David Green', approved_for_website: true, created_at: toDate('2024-09-09T11:00:00Z') },
        { property_id: pid['Canary Wharf Suites – 12'], source: 'hostaway', source_review_id: 'HA-4014', type: 'guest-to-host', status: 'published', rating: 5.0, comment: 'Loved the river view!', channel: 'google', submitted_at: toDate('2024-11-29T17:50:00Z'), guest_name: 'Ella Turner', approved_for_website: true, created_at: toDate('2024-11-30T09:00:00Z') },

        // 2025 (7)
        { property_id: pid['Canary Wharf Suites – 12'], source: 'hostaway', source_review_id: 'HA-4015', type: 'guest-to-host', status: 'published', rating: 5.0, comment: 'Perfect river view in 2025.', channel: 'airbnb', submitted_at: toDate('2025-02-11T20:20:00Z'), guest_name: 'Sophia Wilson', approved_for_website: true, created_at: toDate('2025-02-12T10:00:00Z') },
        { property_id: pid['Kensington Place – 7'], source: 'hostaway', source_review_id: 'HA-4016', type: 'guest-to-host', status: 'published', rating: 4.0, comment: 'Quiet holiday in 2025.', channel: 'google', submitted_at: toDate('2025-04-08T15:00:00Z'), guest_name: 'Daniel Lee', approved_for_website: true, created_at: toDate('2025-04-09T09:00:00Z') },
        { property_id: pid['Shoreditch Heights – 29'], source: 'hostaway', source_review_id: 'HA-4017', type: 'guest-to-host', status: 'published', rating: 2.0, comment: 'Disappointing service.', channel: 'booking', submitted_at: toDate('2025-05-21T12:30:00Z'), guest_name: 'Hannah Clark', approved_for_website: false, created_at: toDate('2025-05-22T11:00:00Z') },
        { property_id: pid['Kensington Place – 7'], source: 'hostaway', source_review_id: 'HA-4018', type: 'guest-to-host', status: 'published', rating: 3.0, comment: 'Average, could improve cleaning.', channel: 'airbnb', submitted_at: toDate('2025-06-19T14:20:00Z'), guest_name: 'Olivia White', approved_for_website: false, created_at: toDate('2025-06-20T09:00:00Z') },
        { property_id: pid['Shoreditch Heights – 29'], source: 'hostaway', source_review_id: 'HA-4019', type: 'guest-to-host', status: 'published', rating: 5.0, comment: 'Fantastic new year stay!', channel: 'airbnb', submitted_at: toDate('2025-01-03T09:00:00Z'), guest_name: 'Tom Jackson', approved_for_website: true, created_at: toDate('2025-01-04T08:00:00Z') },
        { property_id: pid['Canary Wharf Suites – 12'], source: 'hostaway', source_review_id: 'HA-4020', type: 'guest-to-host', status: 'published', rating: 1.0, comment: 'Worst experience, poor maintenance.', channel: 'booking', submitted_at: toDate('2025-07-12T10:30:00Z'), guest_name: 'Jake Turner', approved_for_website: false, created_at: toDate('2025-07-13T09:00:00Z') },
        { property_id: pid['Kensington Place – 7'], source: 'hostaway', source_review_id: 'HA-4021', type: 'guest-to-host', status: 'published', rating: 5.0, comment: 'Amazing host, would return again.', channel: 'google', submitted_at: toDate('2025-09-22T18:00:00Z'), guest_name: 'Maya Lopez', approved_for_website: true, created_at: toDate('2025-09-23T10:00:00Z') },
    ];


    const insertedReviews = await queryInterface.bulkInsert('review', reviews, { returning: true });
    const idByExt = Object.fromEntries((insertedReviews ?? []).map(r => [r.source_review_id, r.id]));

    // categories
    const cats = [
        { review_id: idByExt['HA-4001'], category: 'cleanliness', score: 9 },
        { review_id: idByExt['HA-4002'], category: 'noise', score: 5 },
        { review_id: idByExt['HA-4003'], category: 'hospitality', score: 10 },
        { review_id: idByExt['HA-4004'], category: 'heating', score: 3 },
        { review_id: idByExt['HA-4010'], category: 'design', score: 9 },
        { review_id: idByExt['HA-4011'], category: 'wifi', score: 4 },
        { review_id: idByExt['HA-4012'], category: 'cleanliness', score: 10 },
        { review_id: idByExt['HA-4013'], category: 'space', score: 9 },
        { review_id: idByExt['HA-4014'], category: 'view', score: 10 },
        { review_id: idByExt['HA-4015'], category: 'view', score: 10 },
        { review_id: idByExt['HA-4016'], category: 'peacefulness', score: 9 },
        { review_id: idByExt['HA-4020'], category: 'maintenance', score: 1 },
        { review_id: idByExt['HA-4021'], category: 'hospitality', score: 10 },
    ];
    await queryInterface.bulkInsert('review_category', cats, {});

    // manager responses
    const now2 = new Date();
    const responses = [
        { review_id: idByExt['HA-4001'], body: 'Thanks Alice! Glad you enjoyed your stay.', responded_at: now2 },
        { review_id: idByExt['HA-4003'], body: 'Appreciate your kind words, Emma!', responded_at: now2 },
        { review_id: idByExt['HA-4012'], body: 'Thanks Henry, hope to see you again!', responded_at: now2 },
        { review_id: idByExt['HA-4015'], body: 'So glad you loved the view, Sophia!', responded_at: now2 },
        { review_id: idByExt['HA-4021'], body: 'Thank you Maya, welcome back anytime!', responded_at: now2 },
    ];
    await queryInterface.bulkInsert('manager_response', responses, {});
}

export async function down(queryInterface) {
    await queryInterface.bulkDelete('manager_response', null, {});
    await queryInterface.bulkDelete('review_category', null, {});
    await queryInterface.bulkDelete('review', {
        source_review_id: {
            [Op.in]: [
                'HA-4001', 'HA-4002', 'HA-4003', 'HA-4004', 'HA-4005', 'HA-4006', 'HA-4007',
                'HA-4008', 'HA-4009', 'HA-4010', 'HA-4011', 'HA-4012', 'HA-4013', 'HA-4014',
                'HA-4015', 'HA-4016', 'HA-4017', 'HA-4018', 'HA-4019', 'HA-4020', 'HA-4021',
            ],
        },
    }, {});
    await queryInterface.bulkDelete('property', {
        name: { [Op.in]: ['Shoreditch Heights – 29', 'Canary Wharf Suites – 12', 'Kensington Place – 7'] },
    }, {});
}

