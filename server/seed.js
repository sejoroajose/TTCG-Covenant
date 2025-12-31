const pg = require('pg');

const data = [
  {
    id: 1,
    scripture: "Call to Me, and I will answer you, and show you great and mighty things, which you do not know.",
    reference: "Jeremiah 33:3 (NKJV)",
    category: "Promise",
  },
  {
    id: 2,
    scripture: "Clothe yourselves with the full armor of God so that you may be able to stand against the schemes of the devil.",
    reference: "Ephesians 6:11 (NET)",
    category: "Promise",
  },
  {
    id: 3,
    scripture: "For You, Lord, will bless the righteous; with favour will you compass him as with a shield.",
    reference: "Psalm 5:12",
    category: "Promise",
  },
  {
    id: 4,
    scripture: "I have set the Lord always before me: because He is at my right hand, I shall not be moved. Therefore my heart is glad, and my tongue rejoices: my body also shall dwell secure.",
    reference: "Psalm 16:8-9",
    category: "Promise",
  },
  {
    id: 5,
    scripture: "The eternal God is your refuge, and underneath are the everlasting arms: and He shall thrust out the enemy from before you; and shall say, “Destroy them.”",
    reference: "Deuteronomy 33:27",
    category: "Promise",
  },
  {
    id: 6,
    scripture: "I have raised him up in righteousness, and I will direct all his ways; he shall build My city and let My exiles go free, not for price nor reward,” says the Lord of Hosts.",
    reference: "Isaiah 45:13",
    category: "Promise",
  },
  {
    id: 7,
    scripture: "Thus says the Lord, your Redeemer, the Holy One of Israel: I am the Lord your God, Who teaches you to profit, Who leads you by the way you should go.",
    reference: "Isaiah 48:17",
    category: "Promise",
  },
  {
    id: 8,
    scripture: "But the Lord is faithful, who shall stablish you, and keep you from evil.",
    reference: "2 Thessalonians 3:3",
    category: "Promise",
  },
  {
    id: 9,
    scripture: "Being confident of this very thing, that He which has begun a good work in you will perform it until the day of Jesus Christ.",
    reference: "Philippians 1:6",
    category: "Promise",
  },
  {
    id: 10,
    scripture: "And I give unto them eternal life; and they shall never perish, neither shall any man pluck them out of My hand. My Father, which gave them to Me, is greater than all; and no man is able to pluck them out of My Father’s hand.",
    reference: "John 10:28-29",
    category: "Promise",
  },
  {
    id: 11,
    scripture: "Are not two sparrows sold for a farthing? One of them shall not fall on the ground apart from your Father’s will. But the very hairs of your head are numbered. Fear you not therefore, you are of more value than many sparrows.",
    reference: "Matthew 10:29-31",
    category: "Promise",
  },
  {
    id: 12,
    scripture: "No weapon that is formed against you shall prosper; and every tongue that shall rise against you in judgment you shall condemn. This is the heritage of the servants of the Lord, and their righteousness is of Me,” says the Lord.",
    reference: "Isaiah 54:17",
    category: "Promise",
  },
  {
    id: 13,
    scripture: "But now says the Lord that created you, O Jacob, and He that formed you O Israel. Fear not: for I have redeemed you, I have called you by your name; you are Mine. When you pass through the waters, I will be with you; and through the rivers, they shall not overflow you: when you walk through the fire, you shall not be burned: neither shall the flame kindle upon you. For I am the Lord your God, the Holy One of Israel, your Saviour: I gave Egypt for your ransom, Ethiopia and Seba for you.",
    reference: "Isaiah 43:1-3",
    category: "Promise",
  },
  {
    id: 14,
    scripture: "I have come into the world as light, so that no one who believes in me should stay in darkness.",
    reference: "John 12:46",
    category: "Promise",
  },
  {
    id: 15,
    scripture: "Yet to all who received him, to those who believed in his name, he gave the right to become children of God.",
    reference: "John 1:12",
    category: "Promise",
  },
  {
    id: 16,
    scripture: "Know therefore that the Lord your God is God; he is the faithful God, keeping his covenant of love to a thousand generations of those who love him and keep his commands.",
    reference: "Deuteronomy 7:9",
    category: "Promise",
  },
  {
    id: 17,
    scripture: "Though the mountains be shaken and the hills be moved, yet my unfailing love for you will not be shaken nor my covenant of peace be removed.",
    reference: "Isaiah 54:10",
    category: "Promise",
  },
  {
    id: 18,
    scripture: "I will instruct you and teach you in the way you should go; I will counsel you and watch over you.",
    reference: "Psalm 32:8",
    category: "Promise",
  },
  {
    id: 19,
    scripture: "I will lead the blind by ways they have not known, along unfamiliar paths I will guide them, I will turn the darkness into light before them and make the rough places smooth. These are the things I will do; I will not forsake them.",
    reference: "Isaiah 42:16",
    category: "Promise",
  },
  {
    id: 20,
    scripture: "but I will see you again and you will rejoice, and no one will take away your joy.",
    reference: "John 16:22",
    category: "Promise",
  },
  {
    id: 21,
    scripture: "For through me your days will be many, and years will be added to your life.",
    reference: "Proverbs 9:11",
    category: "Promise",
  },
  {
    id: 22,
    scripture: "Even to your old age and gray hairs I am he, I am he who will sustain you. I have made you and I will carry you; I will sustain you and I will rescue you.",
    reference: "Isaiah 46:4",
    category: "Promise",
  },
  {
    id: 23,
    scripture: "I have loved you with an everlasting love; I have drawn you with loving-kindness.",
    reference: "Jeremiah 31:3",
    category: "Promise",
  },
  {
    id: 24,
    scripture: "No eye has seen, no ear has heard, no mind has conceived what God has prepared for those who love him.",
    reference: "1 Corinthians 2:9",
    category: "Promise",
  },
  {
    id: 25,
    scripture: "the Lord longs to be gracious to you; he rises to show you compassion. For the Lord is a God of justice. Blessed are all who wait for him!",
    reference: "Isaiah 30:18",
    category: "Promise",
  },
  {
    id: 26,
    scripture: "As a father has compassion on his children, so the Lord has compassion on those who fear him.",
    reference: "Psalm 103:13",
    category: "Promise",
  },
  {
    id: 27,
    scripture: "Peace I leave with you, my peace I give you. I do not give as the world gives. Do not let your hearts be troubled and do not be afraid.",
    reference: "John 14:27",
    category: "Promise",
  },
  {
    id: 28,
    scripture: "Before they call I will answer; while they are still speaking I will hear.",
    reference: "Isaiah 65:24",
    category: "Promise",
  },
  {
    id: 29,
    scripture: "Then you will call upon me and come and pray to me, and I will listen to you.",
    reference: "Jeremiah 29:12",
    category: "Promise",
  },
  {
    id: 30,
    scripture: "The Lord will keep you from all harm–he will watch over your life; the Lord will watch over your coming and going both now and forevermore.",
    reference: "Psalm 121:7-8",
    category: "Promise",
  },
  {
    id: 31,
    scripture: "This is the assurance we have in approaching God; that if we ask anything according to his will, he hears us.",
    reference: "1 John 5:14",
    category: "Promise",
  },
  {
    id: 32,
    scripture: "When you pass through the waters, I will be with you; and when you pass through the rivers, they will not sweep over you. When you walk through the fire, you will not be burned; the flames will not set you ablaze.",
    reference: "Isaiah 43:1-2",
    category: "Promise",
  },
  {
    id: 33,
    scripture: "But whoever listens to me will live in safety and be at ease, without fear of harm.",
    reference: "Proverbs 1:33",
    category: "Promise",
  },
  {
    id: 34,
    scripture: "Therefore, if anyone is in Christ, he is a new creation; the old has gone, the new has come!",
    reference: "2 Corinthians 5:17",
    category: "Promise",
  },
  {
    id: 35,
    scripture: "That everyone may eat and drink, and find satisfaction in all his toil–this is the gift of God.",
    reference: "Ecclesiastes 3:13",
    category: "Promise",
  },
  {
    id: 36,
    scripture: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways acknowledge him, and he will make your paths straight.",
    reference: "Proverbs 3:5-6",
    category: "Promise",
  },
  {
    id: 37,
    scripture: "With me are riches and honor, enduring wealth and prosperity. My fruit is better than fine gold; what I yield surpasses choice silver.",
    reference: "Proverbs 8:18-19",
    category: "Promise",
  },
  {
    id: 38,
    scripture: "For the Lord gives wisdom, and from his mouth come knowledge and understanding.",
    reference: "Proverbs 2:6",  // Note: Original said 2:5, likely a typo; common reference is 2:6
    category: "Promise",
  },
  {
    id: 39,
    scripture: "Blessed is the man who makes the Lord his trust….",
    reference: "Psalm 40:4",
    category: "Promise",
  },
  {
    id: 40,
    scripture: "Fix these words of mine in your hearts and minds; tie them as symbols on your hands and bind them on your foreheads.",
    reference: "Deuteronomy 11:18",
    category: "Promise",
  },
  {
    id: 41,
    scripture: "Your word is a lamp to my feet and a light for my path.",
    reference: "Psalm 119:105",
    category: "Promise",
  },
  {
    id: 42,
    scripture: "Now I commit you to God and to the word of his grace, which can build you up and give you an inheritance among all those who are sanctified.",
    reference: "Acts 20:32",
    category: "Promise",
  },
  {
    id: 43,
    scripture: "God shall supply all your need according to His riches in glory by Christ Jesus.",
    reference: "Philippians 4:19",
    category: "Promise",
  },
  {
    id: 44,
    scripture: "Fear not, for I have redeemed you, I have called you by your name; you are mine.",
    reference: "Isaiah 43:1",
    category: "Promise",
  },
  {
    id: 45,
    scripture: "Believe on the Lord Jesus Christ, and you will be saved–you and your household.",
    reference: "Acts 16:31",
    category: "Promise",
  },
  {
    id: 46,
    scripture: "God will redeem my soul from the power of the grave; for He shall receive me.",
    reference: "Psalm 49:15",
    category: "Promise",
  },
];

const config = {
  user: 'avnadmin',
  password: 'AVNS_hLmkNMckTlC48-8hM9r',
  host: 'codeverse-lms-codeverse-lms2024.h.aivencloud.com',
  port: 15909,
  database: 'defaultdb',
  ssl: {
    rejectUnauthorized: true,
    ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUaBayToSo0h6JeKQZhQ9sCJGKilMwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvMjgwNDRkYWMtYzc1My00ODU4LTg3OGEtMTIyZWQ3Nzhj
M2UyIFByb2plY3QgQ0EwHhcNMjQxMDAzMTMxOTIyWhcNMzQxMDAxMTMxOTIyWjA6
MTgwNgYDVQQDDC8yODA0NGRhYy1jNzUzLTQ4NTgtODc4YS0xMjJlZDc3OGMzZTIg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAOCYLPjk
loRm5xDphiNxb+MvyQku7vUIzx6lTzepx3lMhyhWYb57zyAdZxd3EypAY0UELQOx
FDubCZRcJkBU5Eaz6SbZA4s5TNts5GNFjJ4vNpmR5jDD6oRdOr+SOwqKrFizyRjQ
eg2fpqriy9RfxenuhVl988BZHDAKNZGLPdxMt2s7dDZb6WDvKucGsCICDYM5JGG/
inqp3IQ+RnPEdAdz++zVsBBp0/rENrs1Mm7LmLkLEXqaN3akYs2DkaHuwUYP8c4H
CdRJRtvQfmtcAd9DwdrGeCik4tdFS0aXhNigyrukKYv8aifzqKpTgmsH1AMcGAqu
GIWFdxuZ12YoecvOhmbdrHrtgOpeFE9EOJw9ztXNSrEm7zeUZnqvv9Rd1SytXDaH
EpQFrbycC/2kRVykH4zbR+hx0nYql2IqHMLIXqHGN/gGtlSBpSft38af4jI3tzB2
zakcp9xij58pjTt0yE4l/D3I6LdngIzN4fNuw2cPpeyb+4KcPLYn1HLeyQIDAQAB
oz8wPTAdBgNVHQ4EFgQUrv5rzX4MmWkSOVGD2QIqJ3sX2SQwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBANzXKSNkYssF6mPh
NJ43iGzFO51MV2L2GwRDF6G3rB/qWqGX1LcC/JGpavgYRinXMQyt+V9uKtUuxghE
P8UaSkeHgAVAFJmP3NMh8f8YNp8H9GtMRGqeLhdSAiuqo5ZtfaD7SwED9NkcTmcF
ttLAqTTOL4y55N55Do08iG6HvkgubB9COAC4mmC2iUgqDOoBzhlsvFOwPB8Axvkd
YoSWNJH2c8De9Q2qpeyGh+Nh53i12JZE0HoQ0/Hvhta4sgQbd6382osDczTW6RPm
0hDFncp4aunMD2ID93eacksS3yfQajmGTt9uPjJVM+wT3NfPnV6KlOZfOciR0sGz
/2jUKXYkIsg9ZK9nWvHOHa27H3fJITBUU0lQB78UcqX0W96R8GKnlOigX5I4AjPZ
t/cZKEHQbSEMW47UffKyjf+MrUEme8sOQeBFNsOui01mnjSKfI0ZnmAdivfZrNe/
QodqdTKhsPxoviGsXAEYIg/eKohYSLgGU73bGEzgMbXUl9D28A==
-----END CERTIFICATE-----`,
  },
}

const client = new pg.Client(config)

// Function to delete all existing data
async function deleteAllData() {
  try {
    await client.connect()
    await client.query('DELETE FROM covenants')
    console.log('All existing data deleted successfully.')
  } catch (err) {
    console.error('Error deleting data:', err)
  }
}

// Function to seed database
async function seedDatabase() {
  try {
    if (!client._connected) {
      await client.connect()
    }
    
    for (const entry of data) {
      await client.query(
        'INSERT INTO covenants (id, scripture, reference, category) VALUES ($1, $2, $3, $4)',
        [entry.id, entry.scripture, entry.reference, entry.category]
      )
    }
    console.log('Data seeded successfully.')
  } catch (err) {
    console.error('Error seeding data:', err)
  } finally {
    await client.end()
  }
}

// Function to reset database (delete + reseed)
async function resetDatabase() {
  try {
    await client.connect()
    await client.query('DELETE FROM covenants')
    console.log('All existing data deleted.')
    
    // Reset the sequence for auto-incrementing IDs
    await client.query('ALTER SEQUENCE covenants_id_seq RESTART WITH 1')
    
    for (const entry of data) {
      await client.query(
        'INSERT INTO covenants (id, scripture, reference, category, is_selected) VALUES ($1, $2, $3, $4, $5)',
        [entry.id, entry.scripture, entry.reference, entry.category, false]
      )
    }
    console.log('Database reset and reseeded successfully.')
  } catch (err) {
    console.error('Error resetting database:', err)
  } finally {
    await client.end()
  }
}

// Check command line argument
const command = process.argv[2]

if (command === 'delete') {
  deleteAllData()
} else if (command === 'seed') {
  seedDatabase()
} else if (command === 'reset') {
  resetDatabase()
} else {
  console.log('Usage:')
  console.log('  node seed.js seed   - Seed the database with data')
  console.log('  node seed.js delete - Delete all existing data')
  console.log('  node seed.js reset  - Delete and reseed the database')
  process.exit(0)
}