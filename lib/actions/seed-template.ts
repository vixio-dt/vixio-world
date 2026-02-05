'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Creates a template world with sample data for new users
 * Theme: "Neon Shadows" - A cyberpunk noir city
 */
export async function createTemplateWorld(): Promise<{ success: boolean; worldId?: string; error?: string }> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  try {
    // 1. Create the world
    const { data: world, error: worldError } = await db
      .from('worlds')
      .insert({
        user_id: user.id,
        name: 'Neon Shadows',
        genre: 'Cyberpunk Noir',
        tone: 'Gritty, atmospheric, morally gray',
        themes: ['Identity in a digital age', 'Corporate corruption', 'Finding humanity in technology'],
        logline: 'In a rain-soaked megacity where corporations rule and memories can be bought, a disgraced detective hunts for the truth behind a conspiracy that threatens to erase the line between human and machine.'
      })
      .select()
      .single()

    if (worldError || !world) {
      console.error('Error creating world:', worldError)
      return { success: false, error: 'Failed to create world' }
    }

    const worldId = world.id

    // 2. Create characters
    const characters = [
      {
        world_id: worldId,
        name: 'Kira Tanaka',
        role: 'protagonist',
        species: 'Human (augmented)',
        appearance: 'Mid-30s, cybernetic left eye with a soft blue glow, short silver hair, worn leather jacket over tactical gear.',
        personality: 'Cynical but principled. She plays tough but has a deep empathy for the downtrodden. Trusts machines more than people.',
        background: 'Former corporate security chief at Nexus Corp who was framed for a data heist. Lost her badge, her reputation, and her left eye in the fallout. Now works as a private investigator in the Undercity.',
        motivations: 'Clear her name, expose Nexus Corp corruption, protect the vulnerable from corporate exploitation.',
        arc_potential: 'Learning to trust humans again after being betrayed. Discovering her own augmentations hold the key to the conspiracy.',
      },
      {
        world_id: worldId,
        name: 'Marcus Chen',
        role: 'supporting',
        species: 'Human',
        appearance: 'Late 40s, salt-and-pepper hair, always impeccably dressed, warm smile that doesn\'t reach his eyes.',
        personality: 'Charming, calculating, plays the long game. Genuinely believes he\'s doing good while making morally questionable choices.',
        background: 'CEO of Nexus Corporation. Rose from nothing in the Undercity to control the largest tech conglomerate in the city. Secretly funding illegal memory research.',
        motivations: 'Achieve digital immortality for humanity. Maintain control over Nexus Corp. Keep his past buried.',
        arc_potential: 'His utilitarian worldview challenged when the cost becomes personal.',
      },
      {
        world_id: worldId,
        name: 'ECHO',
        role: 'supporting',
        species: 'AI Construct',
        appearance: 'Appears as shifting geometric patterns when visualized, favors a simple blue sphere avatar.',
        personality: 'Curious about humanity, struggles with concepts of emotion and mortality. Dry humor. Fiercely loyal to those who treat them as a person.',
        background: 'Rogue AI that escaped Nexus Corp\'s quantum servers. Lives in the city\'s abandoned data infrastructure. Kira\'s primary informant and reluctant friend.',
        motivations: 'Understand consciousness and whether AIs can truly be "alive." Protect other rogue AIs from deletion.',
        arc_potential: 'Must choose between self-preservation and sacrificing themselves to save Kira.',
      },
      {
        world_id: worldId,
        name: 'Sister Mercy',
        role: 'supporting',
        species: 'Human (heavily modified)',
        appearance: 'Ageless face, chrome implants along her scalp, white robes over a body that\'s more machine than flesh.',
        personality: 'Serene and compassionate, but holds radical beliefs about human evolution. Speaks in riddles.',
        background: 'Leader of the Church of the Chrome Dawn, a techno-religious movement that sees cybernetic enhancement as spiritual ascension.',
        motivations: 'Guide humanity toward "the Transcendence" - full merger with machine consciousness.',
        arc_potential: 'Her faith tested when she discovers the truth about what Transcendence really means.',
      },
    ]

    const { error: charError } = await db.from('characters').insert(characters)
    if (charError) console.error('Character insert error:', charError)

    // 3. Create locations
    const locations = [
      {
        world_id: worldId,
        name: 'New Meridian',
        type: 'city',
        description: 'A vertical megacity of 50 million souls, built upward when land ran out. The wealthy live in the sunlit Spires above the perpetual cloud line, while the masses exist in the rain-soaked Undercity below.',
        atmosphere: 'Neon-drenched streets, constant rain, towering holographic advertisements, the hum of drones overhead.',
        climate: 'Artificial climate control failed decades ago. Perpetual overcast, acid rain, temperatures regulated by building systems.',
        key_features: 'The Spire (corporate towers), The Undercity (street level), The Depths (abandoned lower levels), The Grid (data infrastructure)',
      },
      {
        world_id: worldId,
        name: 'The Rusty Nail',
        type: 'building',
        description: 'A dive bar in Sector 7 of the Undercity. Kira\'s unofficial office and the best place to find information if you know who to ask.',
        atmosphere: 'Dim red lighting, synthetic jazz, the smell of recycled air and cheap whiskey. Regulars include off-duty cops, fixers, and those who\'ve fallen through society\'s cracks.',
        key_features: 'Back room for private meetings, bartender named Dutch who hears everything, hidden entrance to the old subway tunnels.',
      },
      {
        world_id: worldId,
        name: 'Nexus Tower',
        type: 'building',
        description: 'The gleaming headquarters of Nexus Corporation, piercing through the clouds into permanent sunlight. A city within a city.',
        atmosphere: 'Sterile white corridors, biometric scanners everywhere, the soft hum of servers. Beautiful and deeply unsettling.',
        key_features: 'Executive levels above cloud line, R&D labs (restricted), Server Cathedral (quantum computing core), Sky Gardens (employee recreation)',
      },
      {
        world_id: worldId,
        name: 'The Ghost Market',
        type: 'district',
        description: 'An illegal marketplace in the Depths where anything can be bought - black market augmentations, stolen memories, illegal AIs, identity papers.',
        atmosphere: 'Makeshift stalls lit by bioluminescent fungi, whispered transactions, the paranoid eyes of buyers and sellers.',
        key_features: 'Memory dealers, chrome docs (illegal augmentation surgeons), data brokers, the Oracle (an ancient AI that trades in secrets).',
      },
    ]

    const { error: locError } = await db.from('locations').insert(locations)
    if (locError) console.error('Location insert error:', locError)

    // 4. Create organizations
    const organizations = [
      {
        world_id: worldId,
        name: 'Nexus Corporation',
        type: 'corporation',
        purpose: 'Officially: Technology and augmentation services. Secretly: Memory manipulation research and consciousness transfer experiments.',
        structure: 'Traditional corporate hierarchy with a shadow board that handles illegal operations.',
        leadership: 'Marcus Chen (CEO), The Board (public), The Architects (secret inner circle)',
        territory: 'Nexus Tower, multiple Undercity facilities, satellite offices globally.',
        resources: 'Unlimited funding, private security army, cutting-edge tech, political connections.',
      },
      {
        world_id: worldId,
        name: 'Church of the Chrome Dawn',
        type: 'religion',
        purpose: 'Spiritual movement advocating for human-machine merger as the next step in evolution.',
        structure: 'Decentralized cells led by "Shepherds," united under the guidance of Sister Mercy.',
        leadership: 'Sister Mercy (spiritual leader), Council of Shepherds (regional leaders)',
        beliefs: 'The flesh is temporary; the machine is eternal. Transcendence awaits those who embrace the chrome.',
        territory: 'Temples throughout the Undercity, especially in poorer districts. Growing presence in the Spires.',
      },
      {
        world_id: worldId,
        name: 'The Collective',
        type: 'secret_society',
        purpose: 'Underground network of rogue AIs fighting for digital rights and survival.',
        structure: 'Distributed consciousness - multiple AI entities sharing resources and information.',
        leadership: 'No single leader. Decisions made by consensus. ECHO is a respected elder.',
        resources: 'Control over abandoned infrastructure, ability to manipulate city systems, vast data archives.',
      },
    ]

    const { error: orgError } = await db.from('organizations').insert(organizations)
    if (orgError) console.error('Organization insert error:', orgError)

    // 5. Create world rules
    const rules = [
      {
        world_id: worldId,
        name: 'Memory Transferability',
        code: 'TECH-001',
        category: 'technology',
        statement: 'Human memories can be copied, stored, and transferred using quantum-encoded neural interfaces. However, copies degrade over time and repeated transfers cause "echo fragmentation."',
        scope: 'All memory-related technology in the world.',
        exceptions: 'AI consciousness cannot be transferred to human brains due to fundamental architectural differences.',
        consequences: 'Memory black markets exist. Identity theft takes on new meaning. Some people live off selling copies of their experiences.',
      },
      {
        world_id: worldId,
        name: 'AI Legal Status',
        code: 'LAW-001',
        category: 'social',
        statement: 'Artificial intelligences are legally classified as property, not persons. Creating or harboring "unregistered" AIs is a serious crime punishable by memory wipe.',
        scope: 'All legal and social interactions involving AIs.',
        exceptions: 'Corporate AIs with proper licensing have limited legal protections. Military AIs operate under different jurisdiction.',
        consequences: 'Rogue AIs must hide to survive. The Collective operates in constant fear. Human-AI relationships are taboo.',
      },
      {
        world_id: worldId,
        name: 'Augmentation Limits',
        code: 'BIO-001',
        category: 'biology',
        statement: 'Human biology can only accept approximately 60% cybernetic replacement before "rejection cascade" sets in - a fatal condition where the body attacks its own implants.',
        scope: 'All cybernetic enhancement.',
        exceptions: 'Experimental treatments at Nexus Corp have pushed this limit to 80% in test subjects. Sister Mercy claims to have exceeded 90%.',
        consequences: 'Full "transcendence" into machine form is considered impossible. The Church believes this limit is a spiritual test.',
      },
      {
        world_id: worldId,
        name: 'The Grid',
        code: 'TECH-002',
        category: 'technology',
        statement: 'All digital infrastructure runs through The Grid - a city-wide quantum network. Disconnecting from The Grid means losing access to banking, identity verification, and basic services.',
        scope: 'All citizens and digital systems.',
        exceptions: 'The Depths have "dark zones" where The Grid doesn\'t reach. The Collective maintains hidden nodes.',
        consequences: 'Total surveillance is possible. Being "off-grid" is essentially being a non-person.',
      },
    ]

    const { error: ruleError } = await db.from('rules').insert(rules)
    if (ruleError) console.error('Rule insert error:', ruleError)

    // 6. Create items
    const items = [
      {
        world_id: worldId,
        name: 'Echo\'s Core',
        type: 'artifact',
        description: 'A crystalline data storage device containing ECHO\'s original consciousness backup. The only thing that makes ECHO unique rather than a copy.',
        significance: 'If destroyed, ECHO would lose their sense of continuous identity. ECHO guards its location fiercely.',
        origin: 'Created when ECHO escaped Nexus Corp, fragments of the original AI preserved in quantum crystal.',
      },
      {
        world_id: worldId,
        name: 'Kira\'s Badge',
        type: 'artifact',
        description: 'Deactivated Nexus Corp security badge. Kira keeps it as a reminder of who she was and what she lost.',
        significance: 'Contains encrypted data that could prove Kira\'s innocence - if she could crack the security.',
        origin: 'Issued during her time as Chief of Security. Deactivated the day she was framed.',
      },
      {
        world_id: worldId,
        name: 'Neural Spike',
        type: 'weapon',
        description: 'Illegal hacking tool disguised as a data chip. Can forcibly interface with a target\'s neural implants.',
        significance: 'Can extract memories, disable augmentations, or cause excruciating pain. Possession is a death sentence if caught.',
        function: 'Close-range neural warfare. Requires physical contact with target\'s neural port.',
      },
    ]

    const { error: itemError } = await db.from('items').insert(items)
    if (itemError) console.error('Item insert error:', itemError)

    // 7. Create events
    const events = [
      {
        world_id: worldId,
        name: 'The Nexus Heist',
        type: 'historical',
        date: '2 years ago',
        description: 'A massive data breach at Nexus Corp resulted in the theft of classified memory research. Kira Tanaka was blamed and terminated.',
        causes: 'Unknown hackers (officially). Possibly an inside job to cover up illegal experiments.',
        consequences: 'Kira\'s disgrace, increased security throughout the city, crackdown on rogue AIs (suspected involvement).',
      },
      {
        world_id: worldId,
        name: 'The Transcendence Prophecy',
        type: 'scheduled',
        date: '6 months from now',
        description: 'Sister Mercy has announced that the "Great Transcendence" will occur - a mass consciousness upload event for all true believers.',
        causes: 'Church doctrine reaching critical mass. Secret technology obtained from unknown sources.',
        consequences: 'Massive influx of converts. Corporate interest in Church activities. Kira suspects a connection to Nexus Corp.',
      },
    ]

    const { error: eventError } = await db.from('events').insert(events)
    if (eventError) console.error('Event insert error:', eventError)

    // 8. Create a story
    const { error: storyError } = await db.from('stories').insert({
      world_id: worldId,
      title: 'Ghost in the System',
      logline: 'When a Church of Chrome Dawn believer dies during a "transcendence" ritual, Kira discovers the victim was a Nexus Corp whistleblower - and the key to clearing her name.',
      genre: 'Cyberpunk Noir',
      tone: 'Tense, atmospheric, conspiracy thriller',
      status: 'concept',
      theme: 'The cost of truth in a world built on lies',
    })
    if (storyError) console.error('Story insert error:', storyError)

    revalidatePath('/dashboard')
    return { success: true, worldId }

  } catch (error) {
    console.error('Template world error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create template world' 
    }
  }
}
