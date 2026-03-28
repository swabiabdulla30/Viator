/* =====================================================
   VIATOR – Data Layer (localStorage)
   ===================================================== */

const DB = {
  USERS:    'viator_users',
  POSTS:    'viator_posts',
  COMMENTS: 'viator_comments',
  REPORTS:  'viator_reports',
  SESSION:  'viator_session',
  MESSAGES: 'viator_messages',
};

/* ── Helpers ── */
function dbGet(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
}
function dbSet(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}
function dbGetObj(key) {
  try { return JSON.parse(localStorage.getItem(key)) || null; }
  catch { return null; }
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
function hashPw(pw) { return btoa(unescape(encodeURIComponent(pw + '_viator'))); }
function timeAgo(isoStr) {
  const diff = (Date.now() - new Date(isoStr)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff/86400)}d ago`;
  return new Date(isoStr).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
}
function formatDate(isoStr) {
  return new Date(isoStr).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
}

/* ── Seed Data ── */
function seedData() {
  const existingUsers = dbGet(DB.USERS);
  const existingPosts = dbGet(DB.POSTS);

  const adminId = 'admin_001';
  const u1Id = uid(); const u2Id = uid(); const u3Id = uid(); const u4Id = uid();

  const users = [
    {
      id: adminId, name: 'Admin', email: 'admin@viator.com',
      password: hashPw('Admin@123'), role: 'admin',
      bio: 'Platform administrator', avatar: null,
      joinedAt: '2024-01-01T00:00:00Z', status: 'active',
      bookmarks: [], followers: [], following: []
    },
    {
      id: u1Id, name: 'Sofia Reyes', email: 'sofia@example.com',
      password: hashPw('Pass@123'), role: 'user',
      bio: 'Adventure seeker & travel blogger 🌍 | 30+ countries',
      avatar: null, joinedAt: '2024-03-15T10:00:00Z', status: 'active',
      bookmarks: [], followers: [], following: []
    },
    {
      id: u2Id, name: 'James Okafor', email: 'james@example.com',
      password: hashPw('Pass@123'), role: 'user',
      bio: 'Budget traveler | Southeast Asia enthusiast 🎒',
      avatar: null, joinedAt: '2024-05-20T10:00:00Z', status: 'active',
      bookmarks: [], followers: [], following: []
    },
    {
      id: u3Id, name: 'Mei Lin', email: 'mei@example.com',
      password: hashPw('Pass@123'), role: 'user',
      bio: 'Cultural explorer | Food lover 🍜 | Tokyo-based',
      avatar: null, joinedAt: '2024-07-10T10:00:00Z', status: 'active',
      bookmarks: [], followers: [], following: []
    },
    {
      id: u4Id, name: 'Marcus Thorne', email: 'marcus@example.com',
      password: hashPw('Pass@123'), role: 'user',
      bio: 'Urban Photographer & Night Sky Enthusiast 📸✨',
      avatar: null, joinedAt: '2024-08-05T10:00:00Z', status: 'active',
      bookmarks: [], followers: [], following: []
    },
  ];

  const p1 = uid(); const p2 = uid(); const p3 = uid();
  const p4 = uid(); const p5 = uid(); const p6 = uid();
  const p7 = uid(); const p8 = uid();

  const posts = [
    {
      id: p1, userId: u1Id, status: 'approved',
      title: 'Sunrise Trek to Machu Picchu — A Journey Through the Clouds',
      destination: 'Machu Picchu, Peru', country: 'Peru',
      description: `There's nothing quite like arriving at Machu Picchu just before dawn, watching the ancient citadel slowly emerge from the morning mist. I took the 4-day Inca Trail, which was physically demanding but absolutely worth it.\n\nThe trail winds through cloud forests, mountain passes, and Inca ruins before the dramatic final reveal at the Sun Gate. Arriving at sunrise with tired legs and a full heart is an experience I will carry forever.`,
      photos: ['assets/p1.png'],
      travelStyle: 'Adventure',
      budget: 'Mid-range ($50-150/day)',
      tags: ['Peru', 'Hiking', 'UNESCO', 'Inca'],
      tips: 'Book Inca Trail permits at least 6 months in advance. They sell out fast. Acclimatize in Cusco for 2-3 days before starting the trek.',
      lessons: 'Don\'t rush. The journey IS the destination. Slow down and absorb every moment.',
      likes: [u2Id, u3Id],
      createdAt: '2024-09-10T08:00:00Z',
      updatedAt: '2024-09-10T08:00:00Z',
    },
    {
      id: p2, userId: u2Id, status: 'approved',
      title: 'Backpacking Vietnam on $25/Day — The Complete Budget Guide',
      destination: 'Hanoi & Ho Chi Minh City, Vietnam', country: 'Vietnam',
      description: `Vietnam is one of the most budget-friendly destinations in Southeast Asia, and I'm here to prove you can have an incredible experience without breaking the bank.\n\nI spent 3 weeks crossing Vietnam from north to south, using overnight sleeper buses and trains between cities. The street food scene alone is worth the trip — banh mi, pho, bun cha, and ca phe trung (egg coffee) all for under $5.`,
      photos: ['assets/p2.png'],
      travelStyle: 'Budget',
      budget: 'Budget (Under $50/day)',
      tags: ['Vietnam', 'Backpacking', 'Street Food', 'Southeast Asia'],
      tips: 'Use the overnight Reunification Express train between cities to save on accommodation. Book at least 3 days ahead.',
      lessons: 'Learn a few Vietnamese phrases. Locals genuinely appreciate the effort and you\'ll get better prices and experiences.',
      likes: [u1Id, u3Id, adminId],
      createdAt: '2024-09-25T10:00:00Z',
      updatedAt: '2024-09-25T10:00:00Z',
    },
    {
      id: p3, userId: u3Id, status: 'approved',
      title: 'Hidden Temples & Street Food in Kyoto — Beyond the Tourist Trail',
      destination: 'Kyoto, Japan', country: 'Japan',
      description: `Most visitors to Kyoto follow the same well-worn path: Fushimi Inari, Kinkaku-ji, Arashiyama bamboo grove. And yes, these are beautiful — but Kyoto has so much more to offer if you're willing to explore.\n\nI spent two weeks here during autumn, staying in a machiya (traditional townhouse) in the Nishiki market area. Every morning I'd wander through the Nishiki Market for breakfast, then discover a different neighborhood in the afternoon.`,
      photos: ['assets/p3.png'],
      travelStyle: 'Cultural',
      budget: 'Mid-range ($50-150/day)',
      tags: ['Japan', 'Culture', 'Temples', 'Food', 'Autumn'],
      tips: 'Visit popular sites early morning (before 8am) or in the evening. The crowds are dramatically smaller.',
      lessons: 'Japan rewards slow travel. Don\'t try to see everything. Pick 3-4 neighborhoods and explore them deeply.',
      likes: [u1Id, u2Id],
      createdAt: '2024-10-05T10:00:00Z',
      updatedAt: '2024-10-05T10:00:00Z',
    },
    {
      id: p4, userId: u1Id, status: 'approved',
      title: 'Safari in the Serengeti — Witnessing the Great Migration',
      destination: 'Serengeti, Tanzania', country: 'Tanzania',
      description: `Witnessing over a million wildebeest thundering across the golden plains of the Serengeti is one of nature's greatest spectacles. I planned this trip for 18 months, saved every penny, and it was every bit as magnificent as I dreamed.\n\nI stayed at a mid-range eco-lodge and did 6-hour game drives each morning and evening. The golden hour lighting on the savanna with elephants silhouetted against a burning sky — words can't do it justice.`,
      photos: ['assets/p4.png'],
      travelStyle: 'Adventure',
      budget: 'Luxury ($200+/day)',
      tags: ['Tanzania', 'Safari', 'Wildlife', 'Africa', 'Migration'],
      tips: 'Visit July-September for the Great Migration river crossings. Book well in advance — good lodges fill up 12+ months ahead.',
      lessons: 'Wildlife doesn\'t perform on schedule. Patience is everything. The best sightings happened when we stopped chasing and just waited.',
      likes: [u2Id, u3Id, adminId],
      createdAt: '2024-10-20T10:00:00Z',
      updatedAt: '2024-10-20T10:00:00Z',
    },
    {
      id: p5, userId: u2Id, status: 'approved',
      title: 'Island Hopping in Greece on a Budget — Santorini Without the Price Tag',
      destination: 'Greek Islands, Greece', country: 'Greece',
      description: `Everyone says Greece is expensive. They're wrong — or at least, they're only looking at the famous islands. I spent 3 weeks island hopping and kept my budget well under control by choosing lesser-known islands alongside the classics.`,
      photos: ['assets/p5.png'],
      travelStyle: 'Budget',
      budget: 'Budget (Under $50/day)',
      tags: ['Greece', 'Islands', 'Budget', 'Summer', 'Mediterranean'],
      tips: 'Take overnight ferries to save on accommodation. The ferry routes connect most islands and overnight routes give you a free night\'s sleep.',
      lessons: 'The "off" islands — Naxos, Milos, Folegandros — are just as beautiful as Santorini with a fraction of the tourists.',
      likes: [u4Id],
      createdAt: '2024-11-01T10:00:00Z',
      updatedAt: '2024-11-01T10:00:00Z',
    },
    {
      id: p6, userId: u4Id, status: 'approved',
      title: 'Chasing the Aurora — A Winter\'s Tale in Iceland',
      destination: 'Reykjavik & Vik, Iceland', country: 'Iceland',
      description: `Standing on a black sand beach at midnight, watching green curtains of light dance across the sky, is an experience that humbles the soul. Iceland in winter is harsh, unforgiving, and breathtakingly beautiful.\n\nI spent 10 days circumnavigating the Golden Circle and the South Coast. From the thundering Skógafoss waterfall to the silent majesty of the Jökulsárlón glacier lagoon, every mile felt like a scene from another world.`,
      photos: ['assets/p1.png'],
      travelStyle: 'Adventure',
      budget: 'Mid-range ($50-150/day)',
      tags: ['Iceland', 'Northern Lights', 'Winter', 'Photography', 'Nature'],
      tips: 'Rent a 4x4 if you plan to drive. The weather changes in seconds. Download the Aurora forecast app and check it religiously.',
      lessons: 'The best shots require patience and very warm socks. Don\'t forget to put the camera down and just LOOK.',
      likes: [u1Id, adminId],
      createdAt: '2024-11-15T10:00:00Z',
      updatedAt: '2024-11-15T10:00:00Z',
    },
    {
      id: p7, userId: u3Id, status: 'approved',
      title: 'The Colors of Chefchaouen — Morocco\'s Blue City',
      destination: 'Chefchaouen, Morocco', country: 'Morocco',
      description: `Tucked away in the Rif Mountains, Chefchaouen is a surreal dream of blue-washed walls and winding alleyways. Every corner is a postcard, every door a masterpiece of craftsmanship.\n\nI spent four days getting lost in the medina, drinking mint tea with locals, and hiking to the Spanish Mosque for sunset views. The air here is cooler and the pace slower than the frantic energy of Marrakech.`,
      photos: ['assets/p2.png'],
      travelStyle: 'Cultural',
      budget: 'Budget (Under $50/day)',
      tags: ['Morocco', 'Blue City', 'Culture', 'Photography', 'Mountains'],
      tips: 'Visit in the spring or autumn for the best weather. Respect local privacy when taking photos of people or their homes.',
      lessons: 'Getting lost is the point. The most beautiful streets are the ones you find when you stop looking for the "popular" ones.',
      likes: [u1Id, u2Id, u4Id],
      createdAt: '2024-12-05T10:00:00Z',
      updatedAt: '2024-12-05T10:00:00Z',
    },
    {
      id: p8, userId: u4Id, status: 'approved',
      title: 'Monsoon Magic in Kerala — The Soul of India',
      destination: 'Munnar & Alleppey, India', country: 'India',
      description: `There is a specific rhythm to the monsoon in Kerala — the rhythmic drumming of rain on coconut fronds and the scent of wet earth. Many avoid India during the rains, but for me, this is when the land is most alive.\n\nI spent a week on a traditional houseboat in the backwaters of Alleppey, watching the world float by in a haze of emerald green. In Munnar, the tea gardens were wrapped in mist, creating an ethereal landscape that felt like a sanctuary.`,
      photos: ['assets/p3.png'],
      travelStyle: 'Cultural',
      budget: 'Mid-range ($50-150/day)',
      tags: ['India', 'Kerala', 'Monsoon', 'Nature', 'Houseboat'],
      tips: 'Carry a sturdy umbrella and waterproof bags for your gear. Embrace the slow pace — the rain will dictate your schedule.',
      lessons: 'The monsoon isn\'t an inconvenience; it\'s a celebration of life. The lushness you see is worth every drop of rain.',
      likes: [u3Id, adminId],
      createdAt: '2024-12-20T10:00:00Z',
      updatedAt: '2024-12-20T10:00:00Z',
    },
  ];

  const comments = [
    {
      id: uid(), postId: p1, userId: u2Id, parentId: null,
      text: 'This is on my bucket list! Did you hire a guide for the Inca Trail or do it independently?',
      likes: [], createdAt: '2024-09-12T09:00:00Z'
    },
    {
      id: uid(), postId: p1, userId: u1Id, parentId: null,
      text: 'The trail requires registered agencies — no independent trekking allowed. I used Alpaca Expeditions and they were excellent! Worth every penny.',
      likes: [u2Id], createdAt: '2024-09-12T11:00:00Z'
    },
    {
      id: uid(), postId: p2, userId: u3Id, parentId: null,
      text: 'Amazing guide! I\'m heading to Vietnam next month. Is the Reunification Express comfortable?',
      likes: [u2Id], createdAt: '2024-09-27T09:00:00Z'
    },
    {
      id: uid(), postId: p3, userId: u1Id, parentId: null,
      text: 'The machiya experience sounds incredible! Do you have a recommendation?',
      likes: [], createdAt: '2024-10-07T09:00:00Z'
    },
  ];

  // Add missing users (by email)
  let usersToSet = [...existingUsers];
  let usersAdded = false;
  users.forEach(u => {
    if (!usersToSet.find(eu => eu.email.toLowerCase() === u.email.toLowerCase())) {
      usersToSet.push(u);
      usersAdded = true;
    }
  });
  if (usersAdded || existingUsers.length === 0) {
    dbSet(DB.USERS, usersToSet.length ? usersToSet : users);
  }

  // Add missing posts (by title)
  let postsToSet = [...existingPosts];
  let postsAdded = false;
  posts.forEach(p => {
    if (!postsToSet.find(ep => ep.title === p.title)) {
      postsToSet.push(p);
      postsAdded = true;
    }
  });
  if (postsAdded || existingPosts.length === 0) {
    dbSet(DB.POSTS, postsToSet.length ? postsToSet : posts);
  }

  // Comments, Reports, Messages (only if empty)
  if (dbGet(DB.COMMENTS).length === 0) dbSet(DB.COMMENTS, comments);
  if (localStorage.getItem(DB.REPORTS) === null) dbSet(DB.REPORTS, []);
  if (localStorage.getItem(DB.MESSAGES) === null) dbSet(DB.MESSAGES, []);

  // Force update visuals if needed
  let visualUpdate = false;
  const currentPosts = dbGet(DB.POSTS);
  currentPosts.forEach(ep => {
    const sp = posts.find(s => s.title === ep.title);
    if (sp && (!ep.photos || ep.photos.length === 0) && sp.photos && sp.photos.length > 0) {
      ep.photos = sp.photos;
      visualUpdate = true;
    }
  });
  if (visualUpdate) dbSet(DB.POSTS, currentPosts);
}

/* ══ USER OPERATIONS ══ */
const UserDB = {
  getAll: () => dbGet(DB.USERS),
  getById: (id) => dbGet(DB.USERS).find(u => u.id === id) || null,
  getByEmail: (email) => dbGet(DB.USERS).find(u => u.email.toLowerCase() === email.toLowerCase()) || null,
  save: (users) => dbSet(DB.USERS, users),

  create(data) {
    const users = this.getAll();
    const newUser = {
      id: uid(), name: data.name, email: data.email,
      password: hashPw(data.password), role: 'user',
      bio: '', avatar: null,
      joinedAt: new Date().toISOString(), status: 'active',
      bookmarks: [], followers: [], following: []
    };
    users.push(newUser);
    this.save(users);
    return newUser;
  },

  update(id, updates) {
    const users = this.getAll();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updates };
    this.save(users);
    return users[idx];
  },

  delete(id) {
    const users = this.getAll().filter(u => u.id !== id);
    this.save(users);
  },

  toggleBookmark(userId, postId) {
    const users = this.getAll();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return false;
    const bm = users[idx].bookmarks || [];
    const pos = bm.indexOf(postId);
    if (pos === -1) { bm.push(postId); users[idx].bookmarks = bm; this.save(users); return true; }
    else { bm.splice(pos, 1); users[idx].bookmarks = bm; this.save(users); return false; }
  },

  verifyPassword: (user, pw) => user.password === hashPw(pw),
};

/* ══ POST OPERATIONS ══ */
const PostDB = {
  getAll: () => dbGet(DB.POSTS),
  getById: (id) => dbGet(DB.POSTS).find(p => p.id === id) || null,
  getApproved: () => dbGet(DB.POSTS).filter(p => p.status === 'approved'),
  save: (posts) => dbSet(DB.POSTS, posts),
  getPending: () => dbGet(DB.POSTS).filter(p => p.status === 'pending'),
  getByUser: (userId) => dbGet(DB.POSTS).filter(p => p.userId === userId),

  create(data) {
    const posts = this.getAll();
    const newPost = {
      id: uid(),
      userId: data.userId,
      status: 'pending',
      title: data.title,
      destination: data.destination,
      country: data.country || '',
      description: data.description,
      photos: data.photos || [],
      travelStyle: data.travelStyle,
      budget: data.budget,
      tags: data.tags || [],
      tips: data.tips || '',
      lessons: data.lessons || '',
      likes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    posts.push(newPost);
    this.save(posts);
    return newPost;
  },

  update(id, updates) {
    const posts = this.getAll();
    const idx = posts.findIndex(p => p.id === id);
    if (idx === -1) return null;
    posts[idx] = { ...posts[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save(posts);
    return posts[idx];
  },

  delete(id) {
    const posts = this.getAll().filter(p => p.id !== id);
    this.save(posts);
    // also delete comments
    const comments = dbGet(DB.COMMENTS).filter(c => c.postId !== id);
    dbSet(DB.COMMENTS, comments);
  },

  toggleLike(postId, userId) {
    const posts = this.getAll();
    const idx = posts.findIndex(p => p.id === postId);
    if (idx === -1) return false;
    const likes = posts[idx].likes || [];
    const pos = likes.indexOf(userId);
    if (pos === -1) { likes.push(userId); posts[idx].likes = likes; this.save(posts); return true; }
    else { likes.splice(pos, 1); posts[idx].likes = likes; this.save(posts); return false; }
  },

  setStatus(id, status) {
    return this.update(id, { status });
  },

  search(query, filters = {}) {
    let posts = this.getApproved();
    const q = (query || '').toLowerCase().trim();

    if (q) {
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.destination.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q)) ||
        (UserDB.getById(p.userId)?.name || '').toLowerCase().includes(q)
      );
    }
    if (filters.travelStyle) posts = posts.filter(p => p.travelStyle === filters.travelStyle);
    if (filters.budget) posts = posts.filter(p => p.budget === filters.budget);

    if (filters.sort === 'popular') posts.sort((a,b) => (b.likes.length - a.likes.length));
    else if (filters.sort === 'comments') {
      const allComments = dbGet(DB.COMMENTS);
      posts.sort((a,b) => {
        const aCount = allComments.filter(c => c.postId === a.id).length;
        const bCount = allComments.filter(c => c.postId === b.id).length;
        return bCount - aCount;
      });
    } else {
      posts.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return posts;
  },
};

/* ══ COMMENT OPERATIONS ══ */
const CommentDB = {
  getAll: () => dbGet(DB.COMMENTS),
  getByPost: (postId) => dbGet(DB.COMMENTS).filter(c => c.postId === postId),
  save: (c) => dbSet(DB.COMMENTS, c),

  create(data) {
    const comments = this.getAll();
    const newComment = {
      id: uid(), postId: data.postId, userId: data.userId,
      parentId: data.parentId || null, text: data.text,
      likes: [], createdAt: new Date().toISOString()
    };
    comments.push(newComment);
    this.save(comments);
    return newComment;
  },

  delete(id) {
    // Delete comment and its replies
    const all = this.getAll().filter(c => c.id !== id && c.parentId !== id);
    this.save(all);
  },

  getForPost(postId) {
    const all = this.getByPost(postId);
    const roots = all.filter(c => !c.parentId);
    const replies = all.filter(c => c.parentId);
    return roots.map(r => ({ ...r, replies: replies.filter(rep => rep.parentId === r.id) }));
  },
};

/* ══ REPORT OPERATIONS ══ */
const ReportDB = {
  getAll: () => dbGet(DB.REPORTS),
  save: (r) => dbSet(DB.REPORTS, r),

  create(data) {
    const reports = this.getAll();
    const report = {
      id: uid(), postId: data.postId, userId: data.userId,
      reason: data.reason, details: data.details || '',
      status: 'pending', createdAt: new Date().toISOString()
    };
    reports.push(report);
    this.save(reports);
    return report;
  },

  resolve(id) {
    const reports = this.getAll();
    const idx = reports.findIndex(r => r.id === id);
    if (idx !== -1) { reports[idx].status = 'resolved'; this.save(reports); }
  },

  delete(id) {
    this.save(this.getAll().filter(r => r.id !== id));
  },
};

/* ══ MESSAGE OPERATIONS ══ */
const MessagesDB = {
  getAll: () => dbGet(DB.MESSAGES),
  save: (m) => dbSet(DB.MESSAGES, m),

  create(data) {
    const messages = this.getAll();
    const msg = {
      id: uid(), name: data.name, email: data.email,
      message: data.message, status: 'unread',
      createdAt: new Date().toISOString()
    };
    messages.push(msg);
    this.save(messages);
    return msg;
  },

  markRead(id) {
    const messages = this.getAll();
    const idx = messages.findIndex(m => m.id === id);
    if (idx !== -1) { messages[idx].status = 'read'; this.save(messages); }
  },

  delete(id) {
    this.save(this.getAll().filter(m => m.id !== id));
  },
};

/* ══ SESSION ══ */
const SessionDB = {
  get: () => dbGetObj(DB.SESSION),
  set: (user) => localStorage.setItem(DB.SESSION, JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar })),
  clear: () => localStorage.removeItem(DB.SESSION),
  isLoggedIn: () => !!dbGetObj(DB.SESSION),
  isAdmin: () => dbGetObj(DB.SESSION)?.role === 'admin',
  currentUser: () => {
    const s = dbGetObj(DB.SESSION);
    if (!s) return null;
    return UserDB.getById(s.id) || s;
  },
};

function getAdminStats() {
  const users = UserDB.getAll().filter(u => u.role !== 'admin');
  const posts = PostDB.getAll();
  const reports = ReportDB.getAll();
  const messages = MessagesDB.getAll();
  return {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalPosts: posts.filter(p => p.status === 'approved').length,
    pendingPosts: posts.filter(p => p.status === 'pending').length,
    rejectedPosts: posts.filter(p => p.status === 'rejected').length,
    totalReports: reports.length,
    pendingReports: reports.filter(r => r.status === 'pending').length,
    totalMessages: messages.length,
    unreadMessages: messages.filter(m => m.status === 'unread').length,
  };
}

// Auto-seed on every page load
seedData();
