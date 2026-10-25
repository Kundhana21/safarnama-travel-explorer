import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const C = {
  ink: '#173D32',
  ink2: '#31584B',
  paper: '#F7F4EC',
  white: '#FFFFFF',
  muted: '#7F8B80',
  line: '#E6E5DA',
  pale: '#E8EEE5',
  paleGold: '#F6E8CA',
  orange: '#D96F4E',
  gold: '#E9B86B',
  card: '#FFFEFB',
};

const DESTINATIONS = [
  {
    id: 'goa', name: 'Goa', region: 'Goa, West India', category: 'Beaches',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=85',
    description: 'Sun-warmed shores, colourful lanes, Portuguese-era architecture and seafood shacks. Goa can be as lively or as slow as you want it to be.',
    bestTime: 'November – February', days: 4, dailyCost: 3500, vibes: ['beach', 'slow', 'foodie', 'culture'],
    highlights: ['Palolem Beach', 'Fort Aguada', 'Fontainhas Latin Quarter'],
    attractionImages: [
      'https://plus.unsplash.com/premium_photo-1697730411634-5313371ad8fe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
      'https://images.unsplash.com/photo-1605591514039-5f8cdda13287?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
      'https://plus.unsplash.com/premium_photo-1694475049545-f9e69e93b0f3?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D'
    ],
    note: 'Popular for a reason — explore the quieter south for a slower pace.'
  },
  {
    id: 'spiti', name: 'Spiti Valley', region: 'Himachal Pradesh, North India', category: 'Mountains',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85',
    description: 'A high-altitude desert of dramatic mountains, tiny villages, monasteries and enormous skies. This is a trip for travellers who love the journey as much as the destination.',
    bestTime: 'June – September', days: 7, dailyCost: 4500, vibes: ['mountain', 'adventure', 'nature', 'slow'],
    highlights: ['Key Monastery', 'Chandratal Lake', 'Kibber Village'],
    attractionImages: [
      'https://images.unsplash.com/photo-1566241619114-948b5a7df53c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
      'https://images.unsplash.com/photo-1697984286841-5cedb7885109?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'
    ],
    note: 'High altitude and long road journeys mean planning and acclimatisation matter.'
  },
  {
    id: 'jaipur', name: 'Jaipur', region: 'Rajasthan, North-West India', category: 'Heritage',
    image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1000&q=85',
    description: 'The Pink City pairs grand forts and palaces with block-print textiles, bustling bazaars and delicious Rajasthani food.',
    bestTime: 'October – March', days: 3, dailyCost: 3000, vibes: ['culture', 'history', 'foodie', 'slow'],
    highlights: ['Hawa Mahal', 'Amber Fort', 'City Palace'],
    attractionImages: [
      'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1770791366174-f1b88ef1a367?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
      'https://images.unsplash.com/photo-1602643163983-ed0babc39797?auto=format&fit=crop&w=600&q=80'
    ],
    note: 'Leave time between monuments for markets, craft shops and local food.'
  },
  {
    id: 'munnar', name: 'Munnar', region: 'Kerala, South India', category: 'Nature',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=85',
    description: 'Rolling tea gardens, cool air, winding roads and forested hills make Munnar a lovely reset from city life.',
    bestTime: 'September – March', days: 3, dailyCost: 2800, vibes: ['nature', 'mountain', 'slow'],
    highlights: ['Tea Museum', 'Eravikulam National Park', 'Top Station'],
    attractionImages: [
      'https://media.istockphoto.com/id/488761865/photo/tea-country.webp?a=1&b=1&s=612x612&w=0&k=20&c=PalpvkvZ_a47A8GQmbdepreMAfMZMBBIcA7vTRD1Jzw=',
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=600&q=80'
    ],
    note: 'Pack a light layer: evenings can feel cool even when the coast is warm.'
  },
  {
    id: 'hampi', name: 'Hampi', region: 'Karnataka, South India', category: 'Heritage',
    image: 'https://images.unsplash.com/photo-1722934804353-0d9f6a55ab5e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    description: 'Ancient stone temples, giant boulders and sunset viewpoints turn this historic landscape into an open-air adventure.',
    bestTime: 'October – February', days: 3, dailyCost: 2500, vibes: ['culture', 'history', 'adventure', 'nature'],
    highlights: ['Virupaksha Temple', 'Vijaya Vittala Temple', 'Matanga Hill'],
    attractionImages: [
      'https://images.unsplash.com/photo-1599167657458-ee4a1065fa38?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
      'https://images.unsplash.com/photo-1642516861335-97971622499e?auto=format&fit=crop&w=600&q=80',
      'https://media.istockphoto.com/id/972162004/photo/mountain-view-landscape.webp?a=1&b=1&s=612x612&w=0&k=20&c=9a9639wr56yGqnUvBQdId_OdcBvIAU9IGMLTV7rJFEY='
    ],
    note: 'Start outdoor exploring early; afternoons can be very hot in warmer months.'
  },
  {
    id: 'rishikesh', name: 'Rishikesh', region: 'Uttarakhand, North India', category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=85',
    description: 'A riverside town framed by the Himalayas, known for suspension bridges, yoga, riverside cafés and outdoor activities.',
    bestTime: 'March – May, September – November', days: 3, dailyCost: 3000, vibes: ['adventure', 'nature', 'slow'],
    highlights: ['Lakshman Jhula area', 'Triveni Ghat', 'Neer Garh Waterfall'],
    attractionImages: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
      'https://plus.unsplash.com/premium_photo-1697730398251-40cd8dc57e0b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
      'https://media.istockphoto.com/id/507839906/photo/havasupai-falls-arizona.webp?a=1&b=1&s=612x612&w=0&k=20&c=bP1EuFeh4wF3AjZY5LOAT9Y6wqg8yv2I2uXrhUkAZ-g='
    ],
    note: 'Choose registered operators for adventure activities and follow local safety guidance.'
  },
  {
    id: 'meghalaya', name: 'Meghalaya', region: 'North-East India', category: 'Nature',
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1000&q=85',
    description: 'Misty hills, living root bridges, caves and waterfalls make Meghalaya feel like a world of its own.',
    bestTime: 'October – April', days: 5, dailyCost: 3500, vibes: ['nature', 'adventure', 'mountain'],
    highlights: ['Living Root Bridges', 'Dawki River', 'Nohkalikai Falls'],
    attractionImages: [
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=600&q=80',
      'https://plus.unsplash.com/premium_photo-1669887010550-b29c6afef045?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D'
    ],
    note: 'Rain can change road and trail conditions; check locally before setting out.'
  },
  {
    id: 'varkala', name: 'Varkala', region: 'Kerala, South India', category: 'Beaches',
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1000&q=85',
    description: 'Cliffside cafés overlook the Arabian Sea, with sandy coves below and a relaxed coastal rhythm all around.',
    bestTime: 'October – March', days: 3, dailyCost: 2800, vibes: ['beach', 'slow', 'foodie', 'nature'],
    highlights: ['Varkala Cliff', 'Papanasam Beach', 'Kappil Lake'],
    attractionImages: [
      'https://media.istockphoto.com/id/137891177/photo/cliff-in-varcala.webp?a=1&b=1&s=612x612&w=0&k=20&c=6n_7vlJFqI6cpTZJw4NW6j4rtu95uyQUQcpEkBVZfMQ=',
      'https://media.istockphoto.com/id/2154841316/photo/anchuthengu-village-and-papanasam-beach-also-called-as-varkala-beach-thiruvananthapuram.webp?a=1&b=1&s=612x612&w=0&k=20&c=GiuUnx3yR4l5WucUWbJsZJklgbFywraPVYPIMg-Lv7I=',
      'https://media.istockphoto.com/id/1423229173/photo/arai-hills-pune.webp?a=1&b=1&s=612x612&w=0&k=20&c=DUAq7NrO7XbwOFcEe6Hou48ZNgSRC1eQdj6fk7vVv2s='
    ],
    note: 'A great fit for a slower trip with beach walks, cafés and sunset viewpoints.'
  },
  {
    id: 'pondicherry', name: 'Puducherry', region: 'South-East Coast India', category: 'Culture',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=85',
    description: 'Pastel streets, seaside promenades, cafés and Tamil-French cultural influences give Puducherry a distinct character.',
    bestTime: 'November – February', days: 3, dailyCost: 3200, vibes: ['beach', 'culture', 'foodie', 'slow'],
    highlights: ['White Town', 'Rock Beach Promenade', 'Auroville area'],
    attractionImages: [
      'https://images.unsplash.com/photo-1756225747493-a6cc4ccd80a9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1673745422083-87538ccd1f58?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
      'https://media.istockphoto.com/id/1316082626/photo/arial-view-of-auroville.webp?a=1&b=1&s=612x612&w=0&k=20&c=glrfIlr-QdcdqcZvOmo9eKasfv58nXKcWTOxu9hgLJA='
    ],
    note: 'Explore White Town on foot or by cycle, and respect local rules at spiritual spaces.'
  }
];

const CATEGORIES = ['All', 'Beaches', 'Mountains', 'Heritage', 'Adventure', 'Nature', 'Culture'];
const VIBES = [
  { label: 'Surprise me', value: 'any', icon: '✦' },
  { label: 'Beach & slow', value: 'beach', icon: '☼' },
  { label: 'Mountains', value: 'mountain', icon: '⌃' },
  { label: 'Culture & history', value: 'culture', icon: '⌂' },
  { label: 'Adventure', value: 'adventure', icon: '↗' },
  { label: 'Nature escape', value: 'nature', icon: '❋' },
];

function money(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

function ImageOrFallback({ uri, style, resizeMode = 'cover' }) {
  const [failed, setFailed] = useState(false);
  if (failed || !uri) {
    return <View style={[style, styles.imageFallback]}><Text style={styles.fallbackGlyph}>✦</Text></View>;
  }
  return <Image source={{ uri }} style={style} resizeMode={resizeMode} onError={() => setFailed(true)} />;
}

function Pill({ label, active, onPress, small = false }) {
  return (
    <Pressable onPress={onPress} style={[styles.pill, small && styles.pillSmall, active && styles.pillActive]}>
      <Text style={[styles.pillText, small && styles.pillTextSmall, active && styles.pillTextActive]}>{label}</Text>
    </Pressable>
  );
}

function ActionButton({ title, onPress, secondary = false, icon }) {
  return (
    <Pressable onPress={onPress} style={[styles.actionButton, secondary && styles.actionButtonSecondary]}>
      {icon ? <Text style={[styles.actionIcon, secondary && styles.actionTextSecondary]}>{icon}</Text> : null}
      <Text style={[styles.actionText, secondary && styles.actionTextSecondary]}>{title}</Text>
    </Pressable>
  );
}

function DestinationCard({ destination, saved, onPress, onToggleSave, compact = false }) {
  return (
    <Pressable onPress={onPress} style={[styles.destinationCard, compact && styles.destinationCardCompact]}>
      <View style={styles.cardImageWrap}>
        <ImageOrFallback uri={destination.image} style={styles.cardImage} />
        <View style={styles.categoryBadge}><Text style={styles.categoryBadgeText}>{destination.category}</Text></View>
        <Pressable onPress={(event) => { event.stopPropagation(); onToggleSave(); }} style={styles.heartButton} hitSlop={8}>
          <Text style={[styles.heartText, saved && styles.heartSaved]}>{saved ? '♥' : '♡'}</Text>
        </Pressable>
      </View>
      <View style={styles.cardCopy}>
        <Text style={styles.cardName} numberOfLines={1}>{destination.name}</Text>
        <Text style={styles.cardLocation} numberOfLines={1}>⌖  {destination.region}</Text>
        {!compact && <Text style={styles.cardMeta}>{destination.days} days  ·  from {money(destination.dailyCost)}/day</Text>}
      </View>
    </Pressable>
  );
}

export default function App() {
  const [screen, setScreen] = useState('home');
  const [returnTo, setReturnTo] = useState('home');
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [wishlist, setWishlist] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vibe, setVibe] = useState('any');
  const [budget, setBudget] = useState('any');
  const [duration, setDuration] = useState('any');
  const [hasMatched, setHasMatched] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [saved, planned] = await Promise.all([
          AsyncStorage.getItem('@safarnama/wishlist'),
          AsyncStorage.getItem('@safarnama/itinerary'),
        ]);
        if (!alive) return;
        if (saved) setWishlist(JSON.parse(saved));
        if (planned) setItinerary(JSON.parse(planned));
      } catch (error) {
        console.warn('Could not load saved Safarnama data:', error);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!loading) AsyncStorage.setItem('@safarnama/wishlist', JSON.stringify(wishlist)).catch(() => {});
  }, [wishlist, loading]);

  useEffect(() => {
    if (!loading) AsyncStorage.setItem('@safarnama/itinerary', JSON.stringify(itinerary)).catch(() => {});
  }, [itinerary, loading]);

  const filteredDestinations = useMemo(() => {
    const q = search.trim().toLowerCase();
    return DESTINATIONS.filter((d) => {
      const matchesQuery = !q || d.name.toLowerCase().includes(q) || d.region.toLowerCase().includes(q);
      const matchesCategory = category === 'All' || d.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [search, category]);

  const matchedDestinations = useMemo(() => {
    let list = DESTINATIONS.map((d) => {
      let score = 0;
      if (vibe !== 'any' && d.vibes.includes(vibe)) score += 3;
      if (budget === 'low' && d.dailyCost <= 3000) score += 2;
      if (budget === 'mid' && d.dailyCost > 3000 && d.dailyCost < 4500) score += 2;
      if (budget === 'high' && d.dailyCost >= 4500) score += 2;
      if (duration === 'short' && d.days <= 3) score += 2;
      if (duration === 'week' && d.days >= 4 && d.days <= 7) score += 2;
      if (duration === 'long' && d.days >= 6) score += 2;
      return { ...d, matchScore: score };
    });
    if (vibe !== 'any' || budget !== 'any' || duration !== 'any') {
      list = list.filter((d) => d.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore || a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list.slice(0, 3);
  }, [vibe, budget, duration]);

  const toggleWishlist = (id) => setWishlist((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  const addToItinerary = (id) => {
    if (itinerary.includes(id)) {
      Alert.alert('Already in your trip', 'This destination is already on your itinerary.');
      return;
    }
    setItinerary((current) => current.includes(id) ? current : [...current, id]);
    Alert.alert('Added to your trip', 'Your itinerary is saved on this device.');
  };
  const openDetails = (destination, from = screen) => {
    setSelected(destination);
    setReturnTo(from);
    setScreen('details');
  };
  const goTo = (next) => {
    setScreen(next);
    if (next === 'home') { setSearch(''); setCategory('All'); }
  };

  const savedDestinations = wishlist.map((id) => DESTINATIONS.find((d) => d.id === id)).filter(Boolean);
  const plannedDestinations = itinerary.map((id) => DESTINATIONS.find((d) => d.id === id)).filter(Boolean);

  if (loading) {
    return (
  <SafeAreaView style={styles.loadingScreen}>
    <StatusBar
      barStyle="dark-content"
      backgroundColor={C.paper}
    />

    <Text style={styles.splashTitle}>
      safarnama
      <Text style={{ color: C.orange }}>.</Text>
    </Text>
  </SafeAreaView>
);
}

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={C.paper} />
      {screen === 'details' && selected ? (
        <DetailsScreen
          destination={selected}
          saved={wishlist.includes(selected.id)}
          planned={itinerary.includes(selected.id)}
          onBack={() => setScreen(returnTo)}
          onToggleSave={() => toggleWishlist(selected.id)}
          onAddPlan={() => addToItinerary(selected.id)}
        />
      ) : (
        <>
          <View style={styles.screenArea}>
            {screen === 'home' && <HomeScreen search={search} setSearch={setSearch} category={category} setCategory={setCategory} destinations={filteredDestinations} wishlist={wishlist} toggleWishlist={toggleWishlist} openDetails={(d) => openDetails(d, 'home')} openMatcher={() => goTo('match')} />}
            {screen === 'wishlist' && <WishlistScreen destinations={savedDestinations} wishlist={wishlist} toggleWishlist={toggleWishlist} openDetails={(d) => openDetails(d, 'wishlist')} explore={() => goTo('home')} />}
            {screen === 'match' && <MatcherScreen vibe={vibe} setVibe={setVibe} budget={budget} setBudget={setBudget} duration={duration} setDuration={setDuration} hasMatched={hasMatched} setHasMatched={setHasMatched} results={matchedDestinations} wishlist={wishlist} toggleWishlist={toggleWishlist} openDetails={(d) => openDetails(d, 'match')} />}
            {screen === 'plan' && <PlannerScreen destinations={plannedDestinations} remove={(id) => setItinerary((old) => old.filter((x) => x !== id))} openDetails={(d) => openDetails(d, 'plan')} explore={() => goTo('home')} />}
          </View>
          <BottomNav screen={screen} goTo={goTo} wishlistCount={wishlist.length} planCount={itinerary.length} />
        </>
      )}
    </SafeAreaView>
  );
}

function HomeScreen({ search, setSearch, category, setCategory, destinations, wishlist, toggleWishlist, openDetails, openMatcher }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      <View style={styles.headerRow}>
        <View style={styles.brandLockup}><View style={styles.brandMark}><Text style={styles.brandMarkText}>s</Text></View><View><Text style={styles.brandName}>safarnama<Text style={styles.brandDot}>.</Text></Text><Text style={styles.brandSub}>YOUR INDIA, YOUR STORY</Text></View></View>
        <View style={styles.avatar}><Text style={styles.avatarText}>✦</Text></View>
      </View>
      <Text style={styles.eyebrow}>A LITTLE WANDER DOES YOU GOOD</Text>
      <Text style={styles.pageTitle}>Find your next{ '\n' }<Text style={styles.titleItalic}>story.</Text></Text>
      <Text style={styles.pageIntro}>Places to pause, explore, and remember.</Text>

      <Pressable onPress={openMatcher} style={styles.heroCard}>
        <ImageOrFallback uri="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85" style={styles.heroImage} />
        <View style={styles.heroShade} />
        <View style={styles.heroContent}>
          <View style={styles.heroLabel}><Text style={styles.heroLabelText}>THE SMART WAY TO WANDER</Text></View>
          <Text style={styles.heroTitle}>Your kind of{ '\n' }getaway.</Text>
          <Text style={styles.heroDescription}>Tell us your vibe. We'll find a place that fits.</Text>
          <View style={styles.heroCTA}><Text style={styles.heroCTAText}>Find my match</Text><Text style={styles.heroArrow}>↗</Text></View>
        </View>
      </Pressable>

      <View style={styles.sectionHead}><View><Text style={styles.sectionEyebrow}>CURATED FOR THE CURIOUS</Text><Text style={styles.sectionTitle}>Explore India</Text></View><Text style={styles.countLabel}>{DESTINATIONS.length} places</Text></View>
      <View style={styles.searchBox}><Text style={styles.searchIcon}>⌕</Text><TextInput value={search} onChangeText={setSearch} placeholder="Search a place or state…" placeholderTextColor={C.muted} style={styles.searchInput} returnKeyType="search" /><Pressable onPress={() => setSearch('')}><Text style={styles.clearSearch}>{search ? '×' : ''}</Text></Pressable></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
        {CATEGORIES.map((item) => <Pill key={item} label={item} active={category === item} onPress={() => setCategory(item)} />)}
      </ScrollView>
      {destinations.length ? (
        <View style={styles.destinationGrid}>
          {destinations.map((destination) => <DestinationCard key={destination.id} destination={destination} saved={wishlist.includes(destination.id)} onPress={() => openDetails(destination)} onToggleSave={() => toggleWishlist(destination.id)} />)}
        </View>
      ) : (
        <View style={styles.emptySearch}><Text style={styles.emptyEmoji}>⌕</Text><Text style={styles.emptyTitle}>No places found</Text><Text style={styles.emptyBody}>Try another name or switch the category.</Text><ActionButton title="Clear filters" secondary onPress={() => { setSearch(''); setCategory('All'); }} /></View>
      )}
      <View style={styles.footerNote}><Text style={styles.footerNoteMark}>✳</Text><Text style={styles.footerNoteText}>Travel slowly. Leave places better than you found them.</Text></View>
    </ScrollView>
  );
}

function DetailsScreen({ destination, saved, planned, onBack, onToggleSave, onAddPlan }) {
  const openMap = async () => {
    const query = encodeURIComponent(`${destination.name}, ${destination.region}, India`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    try { await Linking.openURL(url); } catch { Alert.alert('Map unavailable', 'Please try opening Google Maps on your device.'); }
  };
  return (
    <ScrollView style={styles.detailsScroll} contentContainerStyle={styles.detailsContent} showsVerticalScrollIndicator={false}>
      <View style={styles.detailHeroWrap}>
        <ImageOrFallback uri={destination.image} style={styles.detailHeroImage} />
        <View style={styles.detailHeroShade} />
        <Pressable onPress={onBack} style={[styles.roundControl, styles.backControl]}><Text style={styles.roundControlText}>‹</Text></Pressable>
        <Pressable onPress={onToggleSave} style={[styles.roundControl, styles.saveControl]}><Text style={[styles.detailHeart, saved && styles.heartSaved]}>{saved ? '♥' : '♡'}</Text></Pressable>
        <View style={styles.detailHeroCaption}><Text style={styles.detailCategory}>{destination.category.toUpperCase()}  ·  INDIA</Text><Text style={styles.detailHeroTitle}>{destination.name}</Text><Text style={styles.detailLocation}>⌖  {destination.region}</Text></View>
      </View>
      <View style={styles.detailMain}>
        <View style={styles.quickFacts}><View style={styles.factItem}><Text style={styles.factIcon}>☼</Text><Text style={styles.factLabel}>BEST TIME</Text><Text style={styles.factValue}>{destination.bestTime}</Text></View><View style={styles.factDivider} /><View style={styles.factItem}><Text style={styles.factIcon}>◷</Text><Text style={styles.factLabel}>SUGGESTED STAY</Text><Text style={styles.factValue}>{destination.days} days</Text></View></View>
        <Text style={styles.sectionEyebrow}>A NOTE FROM THE ROAD</Text><Text style={styles.detailDescription}>{destination.description}</Text>
        <View style={styles.budgetStrip}><View><Text style={styles.budgetLabel}>ESTIMATED DAILY BUDGET</Text><Text style={styles.budgetValue}>{money(destination.dailyCost)} <Text style={styles.budgetPer}>/ person*</Text></Text></View><View style={styles.budgetStamp}><Text style={styles.budgetStampText}>ROUGH{ '\n' }GUIDE</Text></View></View>
        <View style={styles.sectionHead}><View><Text style={styles.sectionEyebrow}>MAKE A LITTLE DETOUR</Text><Text style={styles.sectionTitle}>Worth a visit</Text></View><Text style={styles.countLabel}>3 spots</Text></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.attractionRow}>
          {destination.highlights.map((name, i) => <View key={name} style={styles.attractionCard}><ImageOrFallback uri={destination.attractionImages[i]} style={styles.attractionImage} /><Text style={styles.attractionIndex}>0{i + 1} / SPOT</Text><Text style={styles.attractionName}>{name}</Text></View>)}
        </ScrollView>
        <View style={styles.localTip}><Text style={styles.tipIcon}>✳</Text><View style={styles.tipCopy}><Text style={styles.tipTitle}>A small travel note</Text><Text style={styles.tipText}>{destination.note}</Text></View></View>
        <ActionButton title="Open in Google Maps" onPress={openMap} icon="↗" secondary />
        <View style={styles.actionStack}><ActionButton title={planned ? 'Already in your itinerary' : 'Add to my itinerary'} onPress={onAddPlan} icon={planned ? '✓' : '+'} /><Text style={styles.disclaimer}>*Budget is a rough planning estimate, not a live quote. Actual costs vary by season, transport and travel style.</Text></View>
      </View>
    </ScrollView>
  );
}

function WishlistScreen({ destinations, wishlist, toggleWishlist, openDetails, explore }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerRow}><View style={styles.brandLockup}><View style={styles.brandMark}><Text style={styles.brandMarkText}>s</Text></View><View><Text style={styles.brandName}>safarnama<Text style={styles.brandDot}>.</Text></Text><Text style={styles.brandSub}>YOUR LITTLE COLLECTION</Text></View></View><View style={styles.countBubble}><Text style={styles.countBubbleText}>{wishlist.length}</Text></View></View>
      <Text style={styles.eyebrow}>PLACES TO COME BACK TO</Text><Text style={styles.pageTitle}>Your saved{ '\n' }<Text style={styles.titleItalic}>stories.</Text></Text>
      <Text style={styles.pageIntro}>Keep the places that made you pause.</Text>
      {destinations.length ? <View style={styles.destinationGrid}>{destinations.map((d) => <DestinationCard key={d.id} destination={d} saved onPress={() => openDetails(d)} onToggleSave={() => toggleWishlist(d.id)} />)}</View> : <View style={styles.emptyState}><View style={styles.emptyStateIcon}><Text style={styles.emptyStateIconText}>♡</Text></View><Text style={styles.emptyTitle}>Your wishlist is a blank page.</Text><Text style={styles.emptyBody}>Save the places that call your name. They'll be waiting here when you're ready.</Text><ActionButton title="Explore destinations" onPress={explore} icon="↗" /></View>}
    </ScrollView>
  );
}

function MatcherScreen({ vibe, setVibe, budget, setBudget, duration, setDuration, hasMatched, setHasMatched, results, wishlist, toggleWishlist, openDetails }) {
  const selectStyle = (value, current, setter) => () => { setter(value); setHasMatched(false); };
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerRow}><View style={styles.brandLockup}><View style={styles.brandMark}><Text style={styles.brandMarkText}>s</Text></View><View><Text style={styles.brandName}>safarnama<Text style={styles.brandDot}>.</Text></Text><Text style={styles.brandSub}>A MATCH MADE FOR YOU</Text></View></View><Text style={styles.matchSparkle}>✦</Text></View>
      <Text style={styles.eyebrow}>YOUR NEXT CHAPTER</Text><Text style={styles.pageTitle}>What's your{ '\n' }<Text style={styles.titleItalic}>kind of trip?</Text></Text><Text style={styles.pageIntro}>A few little clues help us find your kind of place.</Text>
      <View style={styles.quizCard}>
        <View style={styles.quizStep}><Text style={styles.quizNumber}>01</Text><Text style={styles.quizQuestion}>Pick your vibe</Text></View>
        <View style={styles.choiceGrid}>{VIBES.map((v) => <Pressable key={v.value} onPress={selectStyle(v.value, vibe, setVibe)} style={[styles.vibeChoice, vibe === v.value && styles.vibeChoiceActive]}><Text style={[styles.vibeIcon, vibe === v.value && styles.vibeIconActive]}>{v.icon}</Text><Text style={[styles.vibeLabel, vibe === v.value && styles.vibeLabelActive]}>{v.label}</Text></Pressable>)}</View>
        <View style={styles.quizRule} />
        <View style={styles.quizStep}><Text style={styles.quizNumber}>02</Text><Text style={styles.quizQuestion}>Daily budget, roughly</Text></View>
        <View style={styles.choiceWrap}>{[{label:'Any',value:'any'},{label:'Under ₹3k',value:'low'},{label:'₹3k–₹4.5k',value:'mid'},{label:'₹4.5k+',value:'high'}].map((x) => <Pill key={x.value} label={x.label} active={budget === x.value} onPress={() => { setBudget(x.value); setHasMatched(false); }} small />)}</View>
        <View style={styles.quizRule} />
        <View style={styles.quizStep}><Text style={styles.quizNumber}>03</Text><Text style={styles.quizQuestion}>How long have you got?</Text></View>
        <View style={styles.choiceWrap}>{[{label:'Any duration',value:'any'},{label:'1–3 days',value:'short'},{label:'4–7 days',value:'week'},{label:'8+ days',value:'long'}].map((x) => <Pill key={x.value} label={x.label} active={duration === x.value} onPress={() => { setDuration(x.value); setHasMatched(false); }} small />)}</View>
        <Pressable style={styles.matchButton} onPress={() => setHasMatched(true)}><Text style={styles.matchButtonText}>Find my destinations</Text><Text style={styles.matchButtonArrow}>↗</Text></Pressable>
        <Text style={styles.matcherFootnote}>Matches are generated from the destination tags, estimated daily budgets and suggested trip lengths stored in this app.</Text>
      </View>
      {hasMatched && <View style={styles.resultsBlock}><View style={styles.sectionHead}><View><Text style={styles.sectionEyebrow}>A FEW PLACES TO START</Text><Text style={styles.sectionTitle}>Your matches</Text></View><Text style={styles.countLabel}>{results.length} found</Text></View>{results.length ? results.map((d, i) => <Pressable key={d.id} onPress={() => openDetails(d)} style={styles.matchResult}><ImageOrFallback uri={d.image} style={styles.matchResultImage} /><View style={styles.matchResultCopy}><View style={styles.matchResultTop}><Text style={styles.matchRank}>MATCH 0{i + 1}</Text><Text style={styles.matchCategory}>{d.category}</Text></View><Text style={styles.matchResultName}>{d.name}</Text><Text style={styles.matchResultRegion}>{d.region}</Text><Text style={styles.matchResultMeta}>{d.days} days · ~{money(d.dailyCost)}/day</Text></View><Pressable hitSlop={8} onPress={(event) => { event.stopPropagation(); toggleWishlist(d.id); }} style={styles.matchHeart}><Text style={[styles.heartText, wishlist.includes(d.id) && styles.heartSaved]}>{wishlist.includes(d.id) ? '♥' : '♡'}</Text></Pressable></Pressable>) : <Text style={styles.emptyBody}>Nothing matched all those preferences just yet. Try “Surprise me” or choose a different budget.</Text>}</View>}
    </ScrollView>
  );
}

function PlannerScreen({ destinations, remove, openDetails, explore }) {
  const totalEstimate = destinations.reduce((sum, d) => sum + d.dailyCost * d.days, 0);
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerRow}><View style={styles.brandLockup}><View style={styles.brandMark}><Text style={styles.brandMarkText}>s</Text></View><View><Text style={styles.brandName}>safarnama<Text style={styles.brandDot}>.</Text></Text><Text style={styles.brandSub}>A PLAN, NOT A PACT</Text></View></View><View style={styles.planStamp}><Text style={styles.planStampText}>✎</Text></View></View>
      <Text style={styles.eyebrow}>ONE DAY, YOU'LL BE THERE</Text><Text style={styles.pageTitle}>The little{ '\n' }<Text style={styles.titleItalic}>plan.</Text></Text><Text style={styles.pageIntro}>Save a few stops. The details can come later.</Text>
      {destinations.length ? <>
        <View style={styles.planSummary}><Text style={styles.planSummaryEyebrow}>YOUR ROUGH ROADMAP</Text><Text style={styles.planSummaryTitle}>{destinations.length} {destinations.length === 1 ? 'place' : 'places'} on the list</Text><View style={styles.planSummaryBottom}><Text style={styles.planSummaryText}>Combined suggested stay: {destinations.reduce((sum, d) => sum + d.days, 0)} days</Text><Text style={styles.planSummaryCost}>~{money(totalEstimate)}</Text></View><Text style={styles.planEstimateNote}>A broad estimate across each destination's suggested stay; excludes travel between places.</Text></View>
        <View style={styles.sectionHead}><View><Text style={styles.sectionEyebrow}>IN YOUR ORDER</Text><Text style={styles.sectionTitle}>Trip stops</Text></View><Text style={styles.countLabel}>Saved on device</Text></View>
        {destinations.map((d, i) => <View key={d.id} style={styles.planStop}><View style={styles.planStopNumber}><Text style={styles.planStopNumberText}>{String(i + 1).padStart(2, '0')}</Text></View><Pressable onPress={() => openDetails(d)} style={styles.planStopMain}><ImageOrFallback uri={d.image} style={styles.planStopImage} /><View style={styles.planStopCopy}><Text style={styles.planStopDay}>STOP {String(i + 1).padStart(2, '0')} · {d.days} DAYS SUGGESTED</Text><Text style={styles.planStopName}>{d.name}</Text><Text style={styles.planStopRegion}>{d.region}</Text></View></Pressable><Pressable onPress={() => Alert.alert('Remove this stop?', `Remove ${d.name} from your itinerary?`, [{ text: 'Keep it', style: 'cancel' }, { text: 'Remove', style: 'destructive', onPress: () => remove(d.id) }])} style={styles.removePlan}><Text style={styles.removePlanText}>×</Text></Pressable></View>)}
        <Text style={styles.plannerNote}>This is a simple ordered list, not a route optimiser. Check travel times between regions before booking.</Text>
      </> : <View style={styles.emptyState}><View style={styles.emptyStateIcon}><Text style={styles.emptyStateIconText}>↗</Text></View><Text style={styles.emptyTitle}>Every great trip starts somewhere.</Text><Text style={styles.emptyBody}>Add a destination from its detail page and build your own little roadmap here.</Text><ActionButton title="Find a place to go" onPress={explore} icon="↗" /></View>}
    </ScrollView>
  );
}

function BottomNav({ screen, goTo, wishlistCount, planCount }) {
  const items = [
    { key: 'home', icon: '⌂', label: 'Explore' },
    { key: 'match', icon: '✳', label: 'For you' },
    { key: 'wishlist', icon: '♡', label: 'Saved', count: wishlistCount },
    { key: 'plan', icon: '↗', label: 'My trip', count: planCount },
  ];
  return <View style={styles.bottomNav}>{items.map((item) => { const active = screen === item.key; return <Pressable key={item.key} onPress={() => goTo(item.key)} style={styles.navItem}><View style={[styles.navIconBox, active && styles.navIconBoxActive]}><Text style={[styles.navIcon, active && styles.navIconActive]}>{item.icon}</Text>{item.count > 0 && <View style={styles.navCount}><Text style={styles.navCountText}>{item.count > 9 ? '9+' : item.count}</Text></View>}</View><Text style={[styles.navLabel, active && styles.navLabelActive]}>{item.label}</Text></Pressable>; })}</View>;
}

const styles = StyleSheet.create({
  splashTitle: {
  color: C.ink,
  fontSize: 46,
  fontWeight: '300',
  fontStyle: 'italic',
  letterSpacing: -1.5,
},
  safeArea: { flex: 1, backgroundColor: C.paper },
  loadingScreen: { flex: 1, backgroundColor: C.paper, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: C.muted, fontSize: 13, letterSpacing: 0.3 },
  screenArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 34 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  brandLockup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 38, height: 38, borderRadius: 13, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-5deg' }] },
  brandMarkText: { color: C.white, fontSize: 28, lineHeight: 31, fontWeight: '700', fontStyle: 'italic' },
  brandName: { color: C.ink, fontSize: 21, fontWeight: '800', letterSpacing: -0.8 },
  brandDot: { color: C.orange },
  brandSub: { color: C.muted, fontSize: 8, fontWeight: '800', letterSpacing: 1.5, marginTop: 1 },
  avatar: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: C.line, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: C.orange, fontSize: 19 },
  eyebrow: { color: C.orange, letterSpacing: 2.1, fontSize: 9, fontWeight: '800', marginBottom: 12 },
  pageTitle: { color: C.ink, fontSize: 43, lineHeight: 45, fontWeight: '800', letterSpacing: -1.9 },
  titleItalic: { color: C.orange, fontStyle: 'italic', fontWeight: '500' },
  pageIntro: { color: C.muted, fontSize: 13, lineHeight: 20, marginTop: 12, marginBottom: 22 },
  heroCard: { height: 285, borderRadius: 23, overflow: 'hidden', backgroundColor: C.ink, marginBottom: 32 },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(13,35,27,0.38)' },
  heroContent: { flex: 1, padding: 22, justifyContent: 'flex-end' },
  heroLabel: { alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 9, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.19)', marginBottom: 12 },
  heroLabelText: { fontSize: 8, color: C.white, fontWeight: '800', letterSpacing: 1.4 },
  heroTitle: { color: C.white, fontSize: 34, lineHeight: 36, fontWeight: '800', letterSpacing: -1 },
  heroDescription: { marginTop: 8, color: '#F0F1EA', fontSize: 12, lineHeight: 18, maxWidth: 240 },
  heroCTA: { marginTop: 17, backgroundColor: C.paper, borderRadius: 12, paddingVertical: 11, paddingHorizontal: 14, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 20 },
  heroCTAText: { color: C.ink, fontWeight: '800', fontSize: 11 },
  heroArrow: { color: C.orange, fontSize: 18, lineHeight: 19 },
  sectionHead: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 15, marginTop: 3 },
  sectionEyebrow: { color: C.muted, fontSize: 8, letterSpacing: 1.65, fontWeight: '800', marginBottom: 5 },
  sectionTitle: { fontSize: 23, fontWeight: '800', letterSpacing: -0.7, color: C.ink },
  countLabel: { color: C.muted, fontSize: 10, paddingBottom: 4 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderColor: C.line, borderWidth: 1, borderRadius: 13, paddingHorizontal: 13, height: 48, gap: 9 },
  searchIcon: { fontSize: 24, lineHeight: 27, color: C.ink2 },
  searchInput: { flex: 1, color: C.ink, fontSize: 12, paddingVertical: 0 },
  clearSearch: { color: C.muted, fontSize: 23, minWidth: 18, textAlign: 'center' },
  categoryRow: { gap: 8, paddingVertical: 14, paddingRight: 6 },
  pill: { backgroundColor: C.white, borderWidth: 1, borderColor: C.line, borderRadius: 30, paddingHorizontal: 14, paddingVertical: 9, alignItems: 'center', justifyContent: 'center' },
  pillActive: { backgroundColor: C.ink, borderColor: C.ink },
  pillSmall: { paddingVertical: 10, paddingHorizontal: 12, marginRight: 2, marginBottom: 2 },
  pillText: { color: C.ink2, fontSize: 11, fontWeight: '600' },
  pillTextSmall: { fontSize: 10 },
  pillTextActive: { color: C.white },
  destinationGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 15 },
  destinationCard: { width: '48.2%', backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: '#EDEBE2', overflow: 'hidden' },
  destinationCardCompact: { width: '48.2%' },
  cardImageWrap: { height: 135, backgroundColor: C.pale, position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  imageFallback: { backgroundColor: '#DAE5D8', alignItems: 'center', justifyContent: 'center' },
  fallbackGlyph: { fontSize: 27, color: C.ink2 },
  categoryBadge: { position: 'absolute', left: 9, top: 9, backgroundColor: 'rgba(247,244,236,0.94)', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 7 },
  categoryBadgeText: { color: C.ink, fontSize: 8, fontWeight: '800' },
  heartButton: { position: 'absolute', top: 8, right: 8, width: 29, height: 29, borderRadius: 15, backgroundColor: 'rgba(255,254,251,0.96)', alignItems: 'center', justifyContent: 'center' },
  heartText: { color: C.ink, fontSize: 20, lineHeight: 24 },
  heartSaved: { color: C.orange },
  cardCopy: { paddingHorizontal: 11, paddingVertical: 11 },
  cardName: { color: C.ink, fontSize: 15, fontWeight: '800', letterSpacing: -0.3 },
  cardLocation: { color: C.muted, fontSize: 9, marginTop: 5 },
  cardMeta: { color: C.ink2, fontSize: 9, marginTop: 8, fontWeight: '600' },
  emptySearch: { alignItems: 'center', paddingVertical: 35, gap: 10 },
  emptyEmoji: { fontSize: 32, color: C.orange },
  emptyTitle: { color: C.ink, fontSize: 19, fontWeight: '800', textAlign: 'center', letterSpacing: -0.5 },
  emptyBody: { color: C.muted, fontSize: 12, lineHeight: 19, textAlign: 'center', maxWidth: 280, marginBottom: 6 },
  footerNote: { marginTop: 28, borderTopWidth: 1, borderTopColor: C.line, paddingTop: 18, flexDirection: 'row', gap: 8, alignItems: 'center' },
  footerNoteMark: { color: C.orange, fontSize: 16 },
  footerNoteText: { color: C.muted, fontSize: 10, fontStyle: 'italic' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10, paddingBottom: 7, paddingHorizontal: 9, backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.line },
  navItem: { minWidth: 58, alignItems: 'center', gap: 4 },
  navIconBox: { width: 44, height: 28, borderRadius: 10, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  navIconBoxActive: { backgroundColor: C.pale },
  navIcon: { fontSize: 20, color: C.muted, lineHeight: 23 },
  navIconActive: { color: C.ink },
  navLabel: { fontSize: 9, color: C.muted, fontWeight: '600' },
  navLabelActive: { color: C.ink, fontWeight: '800' },
  navCount: { position: 'absolute', top: -3, right: 1, minWidth: 15, height: 15, borderRadius: 8, backgroundColor: C.orange, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  navCountText: { color: C.white, fontSize: 8, fontWeight: '800' },
  detailsScroll: { flex: 1, backgroundColor: C.paper },
  detailsContent: { paddingBottom: 26 },
  detailHeroWrap: { height: 355, backgroundColor: C.ink, position: 'relative' },
  detailHeroImage: { width: '100%', height: '100%', position: 'absolute' },
  detailHeroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,30,22,0.39)' },
  roundControl: { position: 'absolute', top: 14, width: 42, height: 42, borderRadius: 22, backgroundColor: 'rgba(247,244,236,0.96)', justifyContent: 'center', alignItems: 'center' },
  backControl: { left: 18 },
  saveControl: { right: 18 },
  roundControlText: { color: C.ink, fontSize: 32, lineHeight: 35, marginTop: -4 },
  detailHeart: { color: C.ink, fontSize: 24, lineHeight: 28 },
  detailHeroCaption: { position: 'absolute', bottom: 25, left: 22, right: 22 },
  detailCategory: { color: '#E9E4D4', fontSize: 9, letterSpacing: 1.8, fontWeight: '800', marginBottom: 8 },
  detailHeroTitle: { color: C.white, fontSize: 40, fontWeight: '800', letterSpacing: -1.2 },
  detailLocation: { color: '#F2F1E9', fontSize: 11, marginTop: 6 },
  detailMain: { paddingHorizontal: 20, paddingTop: 18 },
  quickFacts: { flexDirection: 'row', backgroundColor: C.white, borderRadius: 16, borderWidth: 1, borderColor: C.line, paddingVertical: 16, paddingHorizontal: 13, marginBottom: 23 },
  factItem: { flex: 1, alignItems: 'flex-start' },
  factIcon: { color: C.orange, fontSize: 19, marginBottom: 9 },
  factLabel: { color: C.muted, fontSize: 8, letterSpacing: 1.1, fontWeight: '800', marginBottom: 5 },
  factValue: { color: C.ink, fontSize: 11, fontWeight: '800', lineHeight: 16 },
  factDivider: { width: 1, backgroundColor: C.line, marginHorizontal: 12 },
  detailDescription: { marginTop: 8, color: C.ink2, fontSize: 14, lineHeight: 23, marginBottom: 19 },
  budgetStrip: { backgroundColor: C.pale, borderRadius: 15, padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 27 },
  budgetLabel: { color: C.ink2, fontSize: 8, fontWeight: '800', letterSpacing: 1.2, marginBottom: 5 },
  budgetValue: { color: C.ink, fontSize: 21, fontWeight: '800', letterSpacing: -0.6 },
  budgetPer: { fontSize: 10, color: C.muted, fontWeight: '500', letterSpacing: 0 },
  budgetStamp: { borderWidth: 1, borderColor: '#BBCDB9', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7, transform: [{ rotate: '4deg' }] },
  budgetStampText: { color: C.ink2, fontSize: 8, fontWeight: '800', textAlign: 'center', letterSpacing: 1 },
  attractionRow: { gap: 12, paddingBottom: 5 },
  attractionCard: { width: 165, backgroundColor: C.white, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: C.line },
  attractionImage: { height: 105, width: '100%' },
  attractionIndex: { color: C.orange, fontSize: 8, fontWeight: '800', letterSpacing: 1.1, marginTop: 10, marginHorizontal: 11 },
  attractionName: { color: C.ink, fontSize: 13, fontWeight: '800', lineHeight: 17, marginHorizontal: 11, marginTop: 4, marginBottom: 13 },
  localTip: { backgroundColor: C.paleGold, borderRadius: 14, padding: 14, flexDirection: 'row', gap: 10, marginTop: 23, marginBottom: 15 },
  tipIcon: { color: C.orange, fontSize: 22 },
  tipCopy: { flex: 1 },
  tipTitle: { color: C.ink, fontSize: 12, fontWeight: '800', marginBottom: 4 },
  tipText: { color: C.ink2, fontSize: 11, lineHeight: 17 },
  actionButton: { minHeight: 49, borderRadius: 13, backgroundColor: C.ink, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, paddingHorizontal: 15 },
  actionButtonSecondary: { backgroundColor: C.white, borderColor: C.line, borderWidth: 1 },
  actionText: { color: C.white, fontSize: 12, fontWeight: '800' },
  actionTextSecondary: { color: C.ink },
  actionIcon: { color: C.gold, fontSize: 17, fontWeight: '800' },
  actionStack: { marginTop: 10, gap: 10 },
  disclaimer: { color: C.muted, fontSize: 9, lineHeight: 14, textAlign: 'center', paddingHorizontal: 5 },
  countBubble: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.pale, alignItems: 'center', justifyContent: 'center' },
  countBubbleText: { color: C.ink, fontSize: 13, fontWeight: '800' },
  emptyState: { alignItems: 'center', paddingTop: 47, paddingBottom: 30, paddingHorizontal: 18 },
  emptyStateIcon: { width: 82, height: 82, borderRadius: 28, backgroundColor: C.pale, alignItems: 'center', justifyContent: 'center', marginBottom: 21, transform: [{ rotate: '-5deg' }] },
  emptyStateIconText: { color: C.ink, fontSize: 39 },
  choiceGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 9, marginTop: 13 },
  quizCard: { backgroundColor: C.white, borderWidth: 1, borderColor: C.line, borderRadius: 20, padding: 16 },
  quizStep: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2 },
  quizNumber: { color: C.orange, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  quizQuestion: { color: C.ink, fontSize: 15, fontWeight: '800', letterSpacing: -0.3 },
  vibeChoice: { width: '48.5%', borderWidth: 1, borderColor: C.line, backgroundColor: C.card, borderRadius: 12, minHeight: 70, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  vibeChoiceActive: { borderColor: C.ink, backgroundColor: C.pale },
  vibeIcon: { width: 24, color: C.orange, fontSize: 18, textAlign: 'center' },
  vibeIconActive: { color: C.ink },
  vibeLabel: { color: C.ink2, fontSize: 10, fontWeight: '700', flexShrink: 1 },
  vibeLabelActive: { color: C.ink, fontWeight: '900' },
  quizRule: { height: 1, backgroundColor: C.line, marginVertical: 18 },
  choiceWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 12 },
  matchButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 13, backgroundColor: C.ink, borderRadius: 13, paddingVertical: 15, marginTop: 22 },
  matchButtonText: { color: C.white, fontSize: 12, fontWeight: '800' },
  matchButtonArrow: { color: C.gold, fontSize: 18, lineHeight: 20 },
  matcherFootnote: { color: C.muted, fontSize: 9, lineHeight: 14, textAlign: 'center', marginTop: 12, paddingHorizontal: 4 },
  matchSparkle: { fontSize: 23, color: C.orange },
  resultsBlock: { marginTop: 28 },
  matchResult: { backgroundColor: C.white, borderWidth: 1, borderColor: C.line, borderRadius: 15, padding: 9, flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 11 },
  matchResultImage: { width: 92, height: 98, borderRadius: 10, backgroundColor: C.pale },
  matchResultCopy: { flex: 1, alignSelf: 'stretch', justifyContent: 'center' },
  matchResultTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, gap: 4 },
  matchRank: { fontSize: 8, color: C.orange, letterSpacing: 1.1, fontWeight: '900' },
  matchCategory: { fontSize: 8, color: C.muted },
  matchResultName: { color: C.ink, fontSize: 16, fontWeight: '800' },
  matchResultRegion: { color: C.muted, fontSize: 9, marginTop: 3 },
  matchResultMeta: { color: C.ink2, fontSize: 9, marginTop: 7, fontWeight: '700' },
  matchHeart: { paddingHorizontal: 6, paddingVertical: 10 },
  planStamp: { height: 36, width: 36, borderRadius: 12, backgroundColor: C.paleGold, alignItems: 'center', justifyContent: 'center' },
  planStampText: { fontSize: 21, color: C.orange },
  planSummary: { backgroundColor: C.ink, borderRadius: 19, padding: 19, marginBottom: 27 },
  planSummaryEyebrow: { color: '#B7CDBA', fontSize: 8, fontWeight: '900', letterSpacing: 1.5 },
  planSummaryTitle: { color: C.white, fontSize: 23, fontWeight: '800', letterSpacing: -0.7, marginTop: 9 },
  planSummaryBottom: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, alignItems: 'center', marginTop: 17 },
  planSummaryText: { color: '#E2E9DE', fontSize: 10, flex: 1 },
  planSummaryCost: { color: C.gold, fontSize: 13, fontWeight: '800' },
  planEstimateNote: { color: '#B7CDBA', fontSize: 9, lineHeight: 14, marginTop: 9 },
  planStop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  planStopNumber: { width: 29, height: 29, borderRadius: 10, backgroundColor: C.pale, alignItems: 'center', justifyContent: 'center' },
  planStopNumberText: { color: C.ink, fontWeight: '900', fontSize: 9 },
  planStopMain: { flex: 1, borderRadius: 14, borderColor: C.line, borderWidth: 1, backgroundColor: C.white, padding: 8, flexDirection: 'row', alignItems: 'center', gap: 10 },
  planStopImage: { width: 65, height: 69, borderRadius: 9, backgroundColor: C.pale },
  planStopCopy: { flex: 1 },
  planStopDay: { color: C.orange, fontSize: 7, letterSpacing: 0.9, fontWeight: '900', marginBottom: 5 },
  planStopName: { color: C.ink, fontSize: 14, fontWeight: '800' },
  planStopRegion: { color: C.muted, fontSize: 8, marginTop: 3 },
  removePlan: { width: 28, height: 34, alignItems: 'center', justifyContent: 'center' },
  removePlanText: { color: C.muted, fontSize: 23 },
  plannerNote: { color: C.muted, fontSize: 9, lineHeight: 15, marginTop: 9, fontStyle: 'italic' },
});
