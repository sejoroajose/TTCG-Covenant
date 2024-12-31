const pg = require('pg')

const data = [
  {
    id: 1,
    scripture:
      'For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.',
    reference: 'Jeremiah 29:11',
    category: 'Promise',
  },
  {
    id: 2,
    scripture: 'I can do all things through him who strengthens me.',
    reference: 'Philippians 4:13',
    category: 'Strength',
  },
  {
    id: 3,
    scripture:
      'But they who wait for the Lord shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.',
    reference: 'Isaiah 40:31',
    category: 'Strength',
  },
  {
    id: 4,
    scripture: 'The Lord is my shepherd; I shall not want.',
    reference: 'Psalm 23:1',
    category: 'Provision',
  },
  {
    id: 5,
    scripture:
      'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    reference: 'Romans 8:28',
    category: 'Promise',
  },
  {
    id: 6,
    scripture:
      'Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand.',
    reference: 'Isaiah 41:10',
    category: 'Protection',
  },
  {
    id: 7,
    scripture:
      'Come to me, all who labor and are heavy laden, and I will give you rest. Take my yoke upon you, and learn from me, for I am gentle and lowly in heart, and you will find rest for your souls. For my yoke is easy, and my burden is light.',
    reference: 'Matthew 11:28-30',
    category: 'Peace',
  },
  {
    id: 8,
    scripture: 'For we walk by faith, not by sight.',
    reference: '2 Corinthians 5:7',
    category: 'Faith',
  },
  {
    id: 9,
    scripture:
      'Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.',
    reference: 'Proverbs 3:5-6',
    category: 'Guidance',
  },
  {
    id: 10,
    scripture:
      'God is our refuge and strength, a very present help in trouble.',
    reference: 'Psalm 46:1',
    category: 'Protection',
  },
  {
    id: 11,
    scripture:
      'May the God of hope fill you with all joy and peace in believing, so that by the power of the Holy Spirit you may abound in hope.',
    reference: 'Romans 15:13',
    category: 'Hope',
  },
  {
    id: 12,
    scripture: 'I will never leave you nor forsake you.',
    reference: 'Hebrews 13:5',
    category: 'Promise',
  },
  {
    id: 13,
    scripture:
      'Peace I leave with you; my peace I give to you. Not as the world gives do I give to you. Let not your hearts be troubled, neither let them be afraid.',
    reference: 'John 14:27',
    category: 'Peace',
  },
  {
    id: 14,
    scripture:
      'For my thoughts are not your thoughts, neither are your ways my ways, declares the Lord. For as the heavens are higher than the earth, so are my ways higher than your ways and my thoughts than your thoughts.',
    reference: 'Isaiah 55:8-9',
    category: 'Sovereignty',
  },
  {
    id: 15,
    scripture: 'Casting all your anxieties on him, because he cares for you.',
    reference: '1 Peter 5:7',
    category: 'Care',
  },
  {
    id: 16,
    scripture:
      'What then shall we say to these things? If God is for us, who can be against us?',
    reference: 'Romans 8:31',
    category: 'Confidence',
  },
  {
    id: 17,
    scripture:
      'The Lord is near to the brokenhearted and saves the crushed in spirit.',
    reference: 'Psalm 34:18',
    category: 'Comfort',
  },
  {
    id: 18,
    scripture:
      'The name of the Lord is a strong tower; the righteous man runs into it and is safe.',
    reference: 'Proverbs 18:10',
    category: 'Protection',
  },
  {
    id: 19,
    scripture:
      'I lift up my eyes to the hills. From where does my help come? My help comes from the Lord, who made heaven and earth.',
    reference: 'Psalm 121:1-2',
    category: 'Help',
  },
  {
    id: 20,
    scripture:
      'Finally, be strong in the Lord and in the strength of his might.',
    reference: 'Ephesians 6:10',
    category: 'Strength',
  },
  {
    id: 21,
    scripture:
      'Be strong and courageous. Do not fear or be in dread of them, for it is the Lord your God who goes with you. He will not leave you or forsake you.',
    reference: 'Deuteronomy 31:6',
    category: 'Courage',
  },
  {
    id: 22,
    scripture:
      'The Lord is my rock and my fortress and my deliverer, my God, my rock, in whom I take refuge, my shield, and the horn of my salvation, my stronghold.',
    reference: 'Psalm 18:2',
    category: 'Protection',
  },
  {
    id: 23,
    scripture:
      'The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.',
    reference: 'Lamentations 3:22-23',
    category: 'Faithfulness',
  },
  {
    id: 24,
    scripture:
      'Therefore do not be anxious about tomorrow, for tomorrow will be anxious for itself. Sufficient for the day is its own trouble.',
    reference: 'Matthew 6:34',
    category: 'Peace',
  },
  {
    id: 25,
    scripture:
      'No temptation has overtaken you that is not common to man. God is faithful, and he will not let you be tempted beyond your ability, but with the temptation, he will also provide the way of escape, that you may be able to endure it.',
    reference: '1 Corinthians 10:13',
    category: 'Faithfulness',
  },
  {
    id: 26,
    scripture:
      'If any of you lacks wisdom, let him ask of God, who gives to all liberally and without reproach, and it will be given to him.',
    reference: 'James 1:5',
    category: 'Wisdom',
  },
  {
    id: 27,
    scripture:
      'Delight yourself in the Lord, and he will give you the desires of your heart.',
    reference: 'Psalm 37:4',
    category: 'Joy',
  },
  {
    id: 28,
    scripture:
      'Not only that, but we rejoice in our sufferings, knowing that suffering produces endurance, and endurance produces character, and character produces hope.',
    reference: 'Romans 5:3-4',
    category: 'Endurance',
  },
  {
    id: 29,
    scripture:
      'This God—his way is perfect; the word of the Lord proves true; he is a shield for all those who take refuge in him.',
    reference: '2 Samuel 22:31',
    category: 'Trust',
  },
  {
    id: 30,
    scripture:
      'There is no fear in love, but perfect love casts out fear. For fear has to do with punishment, and whoever fears has not been perfected in love.',
    reference: '1 John 4:18',
    category: 'Love',
  },
  {
    id: 31,
    scripture:
      'You keep him in perfect peace whose mind is stayed on you, because he trusts in you.',
    reference: 'Isaiah 26:3',
    category: 'Peace',
  },
  {
    id: 32,
    scripture:
      'Ask, and it will be given to you; seek, and you will find; knock, and it will be opened to you.',
    reference: 'Matthew 7:7',
    category: 'Promise',
  },
  {
    id: 33,
    scripture:
      'Therefore, since we are surrounded by so great a cloud of witnesses, let us also lay aside every weight, and sin which clings so closely, and let us run with endurance the race that is set before us, looking to Jesus, the founder and perfecter of our faith.',
    reference: 'Hebrews 12:1-2',
    category: 'Faith',
  },
  {
    id: 34,
    scripture:
      'Whatever you do, work heartily, as for the Lord and not for men.',
    reference: 'Colossians 3:23',
    category: 'Work',
  },
  {
    id: 35,
    scripture: 'Seek the Lord and his strength; seek his presence continually!',
    reference: '1 Chronicles 16:11',
    category: 'Strength',
  },
  {
    id: 36,
    scripture:
      'The Lord your God is in your midst, a mighty one who will save; he will rejoice over you with gladness; he will quiet you by his love; he will exult over you with loud singing.',
    reference: 'Zephaniah 3:17',
    category: 'Joy',
  },
  {
    id: 37,
    scripture:
      'You are the light of the world. A city set on a hill cannot be hidden. Nor do people light a lamp and put it under a basket, but on a stand, and it gives light to all in the house. In the same way, let your light shine before others, so that they may see your good works and give glory to your Father who is in heaven.',
    reference: 'Matthew 5:14-16',
    category: 'Witness',
  },
  {
    id: 38,
    scripture:
      'Do not be conformed to this world, but be transformed by the renewal of your mind, that by testing you may discern what is the will of God, what is good and acceptable and perfect.',
    reference: 'Romans 12:2',
    category: 'Transformation',
  },
  {
    id: 39,
    scripture:
      'I have said these things to you, that in me you may have peace. In the world you will have tribulation. But take heart; I have overcome the world.',
    reference: 'John 16:33',
    category: 'Peace',
  },
  {
    id: 40,
    scripture:
      'For you formed my inward parts; you knitted me together in my mother’s womb. I praise you, for I am fearfully and wonderfully made. Wonderful are your works; my soul knows it very well.',
    reference: 'Psalm 139:13-14',
    category: 'Creation',
  },
]

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


async function seedDatabase() {
  try {
    await client.connect()
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

seedDatabase()