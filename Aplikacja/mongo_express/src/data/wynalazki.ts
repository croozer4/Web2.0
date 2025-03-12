export interface Wynalazek {
  id: number;
  nazwa: string;
  tworca: string;
  opis: string;
  zdjecie: string;
  rok: number;
  kategoria: string;
  opatentowany: boolean;
}

const wynalazki: Wynalazek[] = [
  {
    id: 1,
    nazwa: "Telefon",
    tworca: "Alexander Graham Bell",
    opis: "Telefon to urządzenie wynalezione w 1876 roku, które umożliwiło rewolucję w komunikacji, pozwalając ludziom rozmawiać na odległość w czasie rzeczywistym.",
    zdjecie: "https://static.prsa.pl/images/31adf27d-3832-4fec-8c11-31bd7187a8ab.jpg?format=500",
    rok: 1876,
    kategoria: "Komunikacja",
    opatentowany: true,
  },
  {
    id: 2,
    nazwa: "Samochód",
    tworca: "Karl Benz",
    opis: "Pierwszy samochód został stworzony w 1885 roku przez Karla Benza. Był to pojazd trójkołowy, z silnikiem spalinowym, który zapoczątkował erę motoryzacji.",
    zdjecie: "https://ocdn.eu/pulscms-transforms/1/YWsk9kuTURBXy9kNTk3ZmFiNy1jYTZlLTQ5ZTAtYWYxMy0yMjg3MzRkNzdjZjkuanBlZ5DeAAGhMAU",
    rok: 1885,
    kategoria: "Transport",
    opatentowany: true,
  },
  {
    id: 3,
    nazwa: "Internet",
    tworca: "Tim Berners-Lee",
    opis: "Internet, stworzony w 1989 roku, to globalna sieć umożliwiająca przesyłanie danych między komputerami. Tim Berners-Lee stworzył podstawy WWW, otwierając nowe możliwości dla informacji i komunikacji.",
    zdjecie: "https://media.cnn.com/api/v1/images/stellar/prod/210614211407-01-sir-tim-berners-lee-puts-original-world-wide-web-code-up-for-sale.jpg?q=w_2000,c_fill",
    rok: 1989,
    kategoria: "Technologia",
    opatentowany: false,
  },
  {
    id: 4,
    nazwa: "Żarówka",
    tworca: "Thomas Edison",
    opis: "Żarówka wynaleziona przez Thomasa Edisona w 1879 roku zrewolucjonizowała oświetlenie. Był to pierwszy praktyczny sposób na uzyskanie długotrwałego światła.",
    zdjecie: "https://lumigo.pl/wp-content/uploads/2021/02/kiedy-wynaleziono-zarowke-ciekawostki-lumigo-2-1024x576.jpg",
    rok: 1879,
    kategoria: "Oświetlenie",
    opatentowany: true,
  },
  {
    id: 5,
    nazwa: "Samolot",
    tworca: "Bracia Wright",
    opis: "Pierwszy samolot z napędem, zdolny do kontrolowanego lotu, został zbudowany przez braci Wright w 1903 roku. Wynalazek ten otworzył nową erę podróży.",
    zdjecie: "https://ocdn.eu/images/pulscms/Nzk7MDA_/7fc6ca06ae8def7d3e9abef61fd06c58.jpeg",
    rok: 1903,
    kategoria: "Transport",
    opatentowany: true,
  },
  {
    id: 6,
    nazwa: "Druk",
    tworca: "Johannes Gutenberg",
    opis: "Technologia druku wynaleziona przez Gutenberga w XV wieku umożliwiła masową produkcję książek i przyspieszyła rozwój wiedzy oraz kultury.",
    zdjecie: "https://i.gremicdn.pl/image/free/65dff22b096a8130bec7f32577d84245/?t=resize:fill:948:593,enlarge:1",
    rok: 1440,
    kategoria: "Edukacja",
    opatentowany: false,
  },
  {
    id: 7,
    nazwa: "Penicylina",
    tworca: "Alexander Fleming",
    opis: "Penicylina, odkryta przez Alexandra Fleminga w 1928 roku, była pierwszym antybiotykiem, który zrewolucjonizował leczenie infekcji bakteryjnych.",
    zdjecie: "https://lh3.googleusercontent.com/proxy/fvZA_FlN5vD4ko86QCj7KJS2HY-H47RYIp7QIBeMTiVbPhUUrC8X3QpSy50iRKW-tr6G_U_HPVG0BONyctHJ-rkqVPlCheXrfAqTyasJ1IzMEMoHR9LqZCPFQHVaI_7lBi1HTA",
    rok: 1928,
    kategoria: "Medycyna",
    opatentowany: false,
  },
  {
    id: 8,
    nazwa: "Komputer",
    tworca: "Charles Babbage",
    opis: "Podstawy współczesnych komputerów zostały stworzone przez Charlesa Babbage'a w XIX wieku. Jego maszyna analityczna była pierwszym konceptem komputera.",
    zdjecie: "https://cdn.komputerswiat.pl/1/ph6k9lBaHR0cHM6Ly9vY2RuLmV1L3B1bHNjbXMvTURBXy8zN2Q0ODQ3NjU0MDM5MDRhZGEwYzQ4ZTE0ZmFkMGNmNi5qcGeSlQMAAM0FAM0C0JMFzQSwzQJ23gACoTAHoTEE",
    rok: 1837,
    kategoria: "Technologia",
    opatentowany: false,
  },
  {
    id: 9,
    nazwa: "Telewizja",
    tworca: "Philo Farnsworth",
    opis: "Telewizja została rozwinięta w latach 20. XX wieku. Farnsworth opracował kluczowe technologie do przesyłania obrazu w 1927 roku.",
    zdjecie: "https://cdn.britannica.com/28/199428-050-DB65886E/Philo-Farnsworth-television-receiver.jpg",
    rok: 1927,
    kategoria: "Rozrywka",
    opatentowany: true,
  },
  {
    id: 10,
    nazwa: "Silnik parowy",
    tworca: "James Watt",
    opis: "Silnik parowy wynaleziony przez Jamesa Watta w XVIII wieku zapoczątkował rewolucję przemysłową, napędzając maszyny i transport.",
    zdjecie: "https://wykop.pl/cdn/c3201142/comment_xUICTJka00n0ZEl0MxPMCQFOcw9tgB9o.jpg",
    rok: 1765,
    kategoria: "Przemysł",
    opatentowany: true,
  },
];

export default wynalazki;
