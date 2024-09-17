// This would typically fetch data from a database or API
const blogPosts = [
    {
      id: 1,
      title: "5 Tips voor een Schoner Huis met Minder Moeite",
      content: `
        <p>Een schoon huis is essentieel voor een gezonde en comfortabele leefomgeving. Maar laten we eerlijk zijn: niet iedereen heeft de tijd of energie om urenlang schoon te maken. Gelukkig zijn er manieren om uw huis schoon te houden zonder al te veel moeite. Hier zijn vijf eenvoudige tips die u direct kunt toepassen:</p>
  
        <h2>1. Dagelijks 15 minuten opruimen</h2>
        <p>Reserveer elke dag 15 minuten om snel op te ruimen. Zet een timer en focus u op het opruimen van rondslingerende spullen, het afvegen van oppervlakken en het wegbrengen van vuile vaat. Deze korte maar regelmatige sessies voorkomen dat het huishouden u boven het hoofd groeit.</p>
  
        <h2>2. Maak schoonmaken onderdeel van uw routine</h2>
        <p>Integreer kleine schoonmaaktaken in uw dagelijkse routine. Veeg bijvoorbeeld de badkamerspiegel af terwijl u uw tanden poetst, of stof af terwijl u telefooneert. Door schoonmaken te koppelen aan bestaande gewoontes, voelt het minder als een aparte taak.</p>
  
        <h2>3. Gebruik de juiste hulpmiddelen</h2>
        <p>Investeer in kwaliteitsproducten die het schoonmaken vergemakkelijken. Een goede stofzuiger, microvezel doekjes en effectieve allesreinigers kunnen een wereld van verschil maken. Houd uw schoonmaakspullen binnen handbereik, zodat u snel kunt reageren op gemorste vloeistoffen of vuil.</p>
  
        <h2>4. Voorkom rommel</h2>
        <p>Het is makkelijker om een schoon huis te behouden dan het steeds opnieuw schoon te maken. Maak er een gewoonte van om spullen direct op te ruimen na gebruik. Houd entrees vrij van schoenen en jassen, en creëer een systeem voor het sorteren van post en papierwerk.</p>
  
        <h2>5. Verdeel grote taken</h2>
        <p>In plaats van één grote schoonmaakbeurt, verdeel grotere taken over de week. Maak bijvoorbeeld op maandag de badkamer schoon, dinsdag de keuken, woensdag stofzuigen, enzovoort. Dit maakt de taken behapbaar en voorkomt dat u overweldigd raakt.</p>
  
        <p>Door deze tips toe te passen, zult u merken dat uw huis met minder moeite schoner blijft. Vergeet niet dat een perfect huis niet realistisch is - focus op een schone en comfortabele leefruimte die bij uw levensstijl past. En onthoud, voor grondige schoonmaakbeurten of specialistische reiniging kunt u altijd rekenen op de professionele diensten van Frisspits!</p>
      `,
      date: "2023-05-15",
      author: "Emma de Vries",
      category: "Huishoudelijke Tips",
      slug: "5-tips-voor-een-schoner-huis"
    },
    {
      id: 2,
      title: "De Voordelen van Professionele Kantoorschoonmaak",
      content: `
        <p>Een schoon en opgeruimd kantoor is meer dan alleen een kwestie van esthetiek. Het heeft een directe impact op de productiviteit, gezondheid en tevredenheid van uw medewerkers. In dit artikel bespreken we de belangrijkste voordelen van professionele kantoorschoonmaak en waarom het een waardevolle investering is voor elk bedrijf.</p>
  
        <h2>1. Verhoogde Productiviteit</h2>
        <p>Een schone werkomgeving stimuleert focus en efficiëntie. Werknemers kunnen zich beter concentreren in een nette ruimte, vrij van afleidende rommel of vuil. Bovendien bespaart een goed georganiseerde werkplek tijd, omdat medewerkers niet hoeven te zoeken naar documenten of benodigdheden.</p>
  
        <h2>2. Verbeterde Gezondheid en Minder Ziekteverzuim</h2>
        <p>Regelmatige professionele schoonmaak vermindert de aanwezigheid van ziektekiemen, allergenen en stof. Dit leidt tot een gezondere werkomgeving en kan het aantal ziekmeldingen aanzienlijk verminderen. Vooral in gedeelde ruimtes zoals vergaderzalen en keukens is grondige reiniging cruciaal.</p>
  
        <h2>3. Professionele Uitstraling</h2>
        <p>Een schoon kantoor maakt een goede eerste indruk op klanten, partners en potentiële werknemers. Het straalt professionaliteit en aandacht voor detail uit, wat het vertrouwen in uw bedrijf kan versterken.</p>
  
        <h2>4. Verlengde Levensduur van Kantoorinventaris</h2>
        <p>Regelmatig onderhoud en reiniging van vloerbedekking, meubilair en apparatuur verlengt hun levensduur. Dit bespaart op lange termijn kosten voor vervanging en reparaties.</p>
  
        <h2>5. Specialistische Kennis en Apparatuur</h2>
        <p>Professionele schoonmaakbedrijven beschikken over gespecialiseerde kennis en geavanceerde apparatuur. Ze weten precies welke methoden en producten het meest effectief zijn voor verschillende oppervlakken en materialen, zonder deze te beschadigen.</p>
  
        <p>Investeren in professionele kantoorschoonmaak is investeren in de gezondheid, productiviteit en het welzijn van uw medewerkers. Het creëert een aangename werkomgeving die niet alleen prettig is om in te vertoeven, maar die ook bijdraagt aan het succes van uw organisatie. Overweeg de diensten van Frisspits voor een grondige en professionele aanpak van uw kantoorschoonmaak.</p>
      `,
      date: "2023-05-22",
      author: "Lars Janssen",
      category: "Zakelijke Schoonmaak",
      slug: "voordelen-professionele-kantoorschoonmaak"
    },
  ]
  
  export async function getBlogPost(slug: string) {
    // In a real application, this would fetch data from a database or API
    return blogPosts.find(post => post.slug === slug)
  }
