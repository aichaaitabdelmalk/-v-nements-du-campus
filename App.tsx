import React from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar } from 'react-native';

type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};



const evenements: Evenement[] = [
  {
    id: 'E01',
    titre: 'Atelier React',
    categorie: 'Atelier',
    capacite: 25,
    inscrits: 25,
  },
  {
    id: 'E02',
    titre: 'Conférence IA',
    categorie: 'Conférence',
    capacite: 70,
    inscrits: 52,
  },
  {
    id: 'E03',
    titre: 'Sécurité mobile',
    categorie: 'Atelier',
    capacite: 20,
    inscrits: 17,
  },
  {
    id: 'E04',
    titre: 'Design UI',
    categorie: 'Atelier',
    capacite: 18,
    inscrits: 9,
  },
  {
    id: 'E05',
    titre: 'Forum projets',
    categorie: 'Rencontre',
    capacite: 50,
    inscrits: 49,
  },
  {
    id: 'E06',
    titre: 'Découverte Git',
    categorie: 'Atelier',
    capacite: 24,
    inscrits: 24,
  },
];


function placesRestantes(e: Evenement): number {
  return Math.max(0, e.capacite - e.inscrits);
}



function statutEvenement(e: Evenement): string {
  const places = placesRestantes(e);

  if (places === 0) {
    return 'Complet';
  } else if (places <= 3) {
    return 'Presque complet';
  } else {
    return 'Ouvert';
  }
}




const totalEvenements = evenements.length;

const evenementsComplets = evenements.filter(
  (e) => placesRestantes(e) === 0
).length;

const evenementsDisponibles = evenements.filter(
  (e) => placesRestantes(e) > 0
).length;

const totalPlaces = evenements.reduce(
  (total, e) => total + placesRestantes(e),
  0
);





type EvenementAvecPlaces = Evenement & {
  places: number;
};

const evenementsAvecPlaces: EvenementAvecPlaces[] = evenements.map(
  (e) => ({
    ...e,
    places: placesRestantes(e),
  })
);






type BadgeEtatProps = {
  statut: string;
};

function BadgeEtat({ statut }: BadgeEtatProps) {
  let couleur = '#D1FAE5';

  if (statut === 'Complet') {
    couleur = '#FECACA';
  } else if (statut === 'Presque complet') {
    couleur = '#FED7AA';
  }
  return (
    <View style={[styles.badge, { backgroundColor: couleur }]}>
      <Text style={styles.badgeTexte}>{statut}</Text>
    </View>
  );
}




type CarteEvenementProps = {
  evenement: EvenementAvecPlaces;
};
function CarteEvenement({ evenement }: CarteEvenementProps) {
   const statut = statutEvenement(evenement);
   return (
     <View style={styles.carte}> 
      <Text style={styles.titreCarte}>
        {evenement.titre} 
        </Text>
    <Text style={styles.categorie}>
        {evenement.categorie}
      </Text>

      <Text style={styles.places}>
        {evenement.places} places libres
      </Text>
      <BadgeEtat statut={statut} />

    </View>
  );
}




type BlocStatistiqueProps = {
  libelle: string;
  nombre: number;
};

function BlocStatistique({
  libelle,
  nombre,
}: BlocStatistiqueProps) {

  return (
    <View style={styles.blocStatistique}>
      <Text style={styles.nombreStatistique}>
        {nombre}
      </Text>

      <Text style={styles.libelleStatistique}>
        {libelle}
      </Text>
    </View>
  );
}




const mode: 'tous' | 'ateliers' = 'tous';
const evenementsAffiches =
  mode === 'tous'
    ? evenementsAvecPlaces
    : evenementsAvecPlaces.filter(
        (e) => e.categorie === 'Atelier' && e.places > 0
      );



export default function App() {

  return (
    <View style={styles.container}>

      <FlatList
        data={evenementsAffiches}

        renderItem={({ item }) => (
          <CarteEvenement evenement={item} />
        )}

        keyExtractor={(item) => item.id}

        ListHeaderComponent={
          <View>

            <Text style={styles.titrePrincipal}>
              CampusAgenda
            </Text>

            <Text style={styles.sousTitre}>
              Événements du campus
            </Text>

            {/* Les statistiques */}
            <View style={styles.statistiques}>

              <BlocStatistique
                libelle="Événements"
                nombre={totalEvenements}
              />

              <BlocStatistique
                libelle="Événements complets"
                nombre={evenementsComplets}
              />

              <BlocStatistique
                libelle="Événements disponibles"
                nombre={evenementsDisponibles}
              />

              <BlocStatistique
                libelle="Places restantes"
                nombre={totalPlaces}
              />

            </View>

            {/* Titre du mode d'affichage */}
            <Text style={styles.titreMode}>
              {mode === 'tous'
                ? 'Tous les événements'
                : 'Ateliers disponibles'}
            </Text>

          </View>
        }

        ListEmptyComponent={
          <Text style={styles.messageVide}>
            Aucun événement disponible.
          </Text>
        }
        contentContainerStyle={styles.contenuListe}
      />

    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingTop: StatusBar.currentHeight ?? 0,
  },

  headerContainer: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  sousTitre: {
    fontSize: 15,
    color: '#DBEAFE',
    marginTop: 8,
  },

  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 15,
  },

  statistique: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    padding: 15,
    marginBottom: 12,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 3,
  },

  valeurStat: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1D4ED8',
  },

  libelleStat: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
  },

  modeTitre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 15,
  },

  liste: {
    paddingHorizontal: 15,
    paddingBottom: 30,
    flexGrow: 1,
  },

  carte: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 15,
    marginBottom: 14,
    elevation: 3,
  },

  carteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 8,
  },

  titreCarte: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    flexShrink: 1,
  },

  categorie: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 10,
  },

  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 12,
  },

  detailTexte: {
    fontSize: 14,
    color: '#475569',
  },

  places: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1D4ED8',
    marginTop: 12,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },

  badgeTexte: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  vide: {
    textAlign: 'center',
    fontSize: 16,
    color: '#64748B',
    marginTop: 30,
  },
});