/**
 * Banque de questions organisée par catégorie
 * Structure : { question, options[], answerIndex }
 */
export const questions = {
  ci: [
    {
      question: "Quelle est la capitale politique de la Côte d'Ivoire ?",
      options: ['Abidjan', 'Yamoussoukro', 'Bouaké', 'San-Pédro'],
      answerIndex: 1
    },
    {
      question: "Quel est le plus grand marché d'Abidjan ?",
      options: ['Marché de Cocody', 'Marché de Treichville', "Marché d'Adjamé", 'Marché de Marcory'],
      answerIndex: 2
    },
    {
      question: "Quelle est la monnaie de la Côte d'Ivoire ?",
      options: ['Naira', 'Cedi', 'Franc CFA', 'Dirham'],
      answerIndex: 2
    },
    {
      question: 'Quel fleuve traverse Abidjan ?',
      options: ['Niger', 'Volta', 'Lagune Ebrié', 'Congo'],
      answerIndex: 2
    },
    {
      question: "Qui est l'auteur de 'Climbié' ?",
      options: ['Ahmadou Kourouma', 'Bernard Dadié', 'Aimé Césaire', 'Camara Laye'],
      answerIndex: 1
    }
  ],

  tech: [
    {
      question: 'Quel langage est utilisé pour styler les pages web ?',
      options: ['HTML', 'Python', 'CSS', 'Java'],
      answerIndex: 2
    },
    {
      question: 'Que signifie API ?',
      options: [
        'Application Programming Interface',
        'Advanced Program Integration',
        'Automated Process Input',
        'Application Process Interface'
      ],
      answerIndex: 0
    },
    {
      question: 'Quel framework JavaScript est créé par Meta ?',
      options: ['Angular', 'Vue.js', 'Svelte', 'React'],
      answerIndex: 3
    },
    {
      question: 'Que signifie SQL ?',
      options: [
        'Simple Query Language',
        'Structured Query Language',
        'System Query Logic',
        'Standard Query Language'
      ],
      answerIndex: 1
    },
    {
      question: 'Quel est le protocole standard du web ?',
      options: ['FTP', 'HTTP', 'SMTP', 'SSH'],
      answerIndex: 1
    }
  ],

  africa: [
    {
      question: "Quel est le plus grand pays d'Afrique par superficie ?",
      options: ['RDC', 'Soudan', 'Algérie', 'Nigéria'],
      answerIndex: 2
    },
    {
      question: 'Qui est le premier président du Ghana indépendant ?',
      options: ['Jomo Kenyatta', 'Kwame Nkrumah', 'Julius Nyerere', 'Patrice Lumumba'],
      answerIndex: 1
    },
    {
      question: "Quel est le plus long fleuve d'Afrique ?",
      options: ['Congo', 'Niger', 'Nil', 'Zambèze'],
      answerIndex: 2
    },
    {
      question: 'Dans quel pays se trouve le Kilimandjaro ?',
      options: ['Kenya', 'Ouganda', 'Tanzanie', 'Éthiopie'],
      answerIndex: 2
    },
    {
      question: "Quelle ville est surnommée 'la perle de l'Afrique' ?",
      options: ['Nairobi', 'Le Caire', 'Kampala', 'Addis-Abeba'],
      answerIndex: 2
    }
  ],

  science: [
    {
      question: 'Quelle planète est la plus proche du Soleil ?',
      options: ['Vénus', 'Mercure', 'Mars', 'Terre'],
      answerIndex: 1
    },
    {
      question: 'Quel gaz les plantes absorbent-elles ?',
      options: ['Oxygène', 'Azote', 'CO2', 'Hydrogène'],
      answerIndex: 2
    },
    {
      question: "Combien d'os a le corps humain adulte ?",
      options: ['186', '206', '226', '256'],
      answerIndex: 1
    },
    {
      question: 'Qui a découvert la pénicilline ?',
      options: ['Pasteur', 'Fleming', 'Curie', 'Darwin'],
      answerIndex: 1
    },
    {
      question: "Quel est l'élément chimique le plus abondant dans l'univers ?",
      options: ['Oxygène', 'Carbone', 'Hélium', 'Hydrogène'],
      answerIndex: 3
    }
  ]
}
