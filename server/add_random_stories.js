const db = require('./db/database');

const adminId = 1;

const newPosts = [
    [
        adminId,
        'Auroras over Iceland',
        'A mesmerizing view of the green lights dancing over the glacial lagoon of Jökulsárlón. The shivering cold was forgotten the moment the sky lit up in vibrant hues of green and purple. The reflection on the calm waters was nothing short of breathtaking.',
        'Jökulsárlón, Iceland',
        'Adventure',
        '/uploads/iceland.png',
        'approved',
        300
    ],
    [
        adminId,
        'Streets of Havana',
        'Cruising down the Malecón in a classic 1950s convertible, the salty breeze mixing with the sound of salsa music from open windows. The vibrant colors of the decaying colonial buildings tell a story of a city frozen in time.',
        'Havana, Cuba',
        'Cultural',
        '/uploads/havana.png',
        'approved',
        450
    ],
    [
        adminId,
        'Safari in the Serengeti',
        'Waking up at dawn to the roars of distant lions. The seemingly endless plains dotted with acacia trees were soon filled with the great migration of wildebeests, a spectacle of nature\'s raw power.',
        'Serengeti, Tanzania',
        'Nature',
        '/uploads/serengeti.png',
        'approved',
        620
    ],
    [
        adminId,
        'Mysteries of Machu Picchu',
        'The morning mist slowly unveiled the ancient Incan citadel sitting perfectly atop the Andes mountains. Llamas grazed peacefully among the ruins, as if guarding the secrets of the past.',
        'Machu Picchu, Peru',
        'History',
        '/uploads/machu_picchu.png',
        'approved',
        542
    ]
];

async function insertRandomStories() {
    console.log('📖 Adding random stories to the database...');

    for (const p of newPosts) {
        db.run('INSERT INTO posts (user_id, title, description, location, category, image_url, status, views) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', p, function(err) {
            if (err) {
                console.error(`Error inserting ${p[1]}:`, err.message);
            } else {
                console.log(`✅ Inserted: ${p[1]}`);
            }
        });
    }

    // Give it some time to finish insertions
    setTimeout(() => {
        console.log('✨ All random stories added successfully!');
        process.exit(0);
    }, 2000);
}

insertRandomStories();
