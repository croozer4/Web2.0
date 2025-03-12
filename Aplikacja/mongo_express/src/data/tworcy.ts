export interface Tworca {
  id: number;
  imie: string;
  nazwisko: string;
  zdjecie: string;
  biografia: string;
  narodowosc: string;
  dataUrodzenia: string;
  dataSmierci?: string;
  wiek?: number;
}

const tworcy: Tworca[] = [
  {
    id: 1,
    imie: "Alexander",
    nazwisko: "Graham Bell",
    zdjecie:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Alexander_Graham_Bell.jpg/277px-Alexander_Graham_Bell.jpg",
    biografia: "Alexander Graham Bell był wynalazcą telefonu i pionierem w dziedzinie komunikacji.",
    narodowosc: "Szkocka",
    dataUrodzenia: "1847-03-03",
    dataSmierci: "1922-08-02",
    wiek: 75,
  },
  {
    id: 2,
    imie: "Karl",
    nazwisko: "Benz",
    zdjecie:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Carl-Benz_coloriert.jpg/270px-Carl-Benz_coloriert.jpg",
    biografia: "Karl Benz zaprojektował pierwszy samochód napędzany silnikiem spalinowym.",
    narodowosc: "Niemiecka",
    dataUrodzenia: "1844-11-25",
    dataSmierci: "1929-04-04",
    wiek: 84,
  },
  {
    id: 3,
    imie: "Tim",
    nazwisko: "Berners-Lee",
    zdjecie:
      "https://upload.wikimedia.org/wikipedia/commons/4/4e/Sir_Tim_Berners-Lee_%28cropped%29.jpg",
    biografia: "Tim Berners-Lee stworzył podstawy sieci WWW, otwierając erę internetu.",
    narodowosc: "Brytyjska",
    dataUrodzenia: "1955-06-08",
    wiek: 69,
  },
  {
    id: 4,
    imie: "Thomas",
    nazwisko: "Edison",
    zdjecie:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Thomas_Edison2-crop.jpg/800px-Thomas_Edison2-crop.jpg",
    biografia: "Thomas Edison był jednym z największych wynalazców, znanym z wynalezienia żarówki.",
    narodowosc: "Amerykańska",
    dataUrodzenia: "1847-02-11",
    dataSmierci: "1931-10-18",
    wiek: 84,
  },
  {
    id: 5,
    imie: "Orville",
    nazwisko: "Wright",
    zdjecie:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Orville_Wright.jpg/755px-Orville_Wright.jpg",
    biografia: "Orville Wright, wraz z bratem Wilburem, zaprojektował pierwszy samolot z napędem.",
    narodowosc: "Amerykańska",
    dataUrodzenia: "1871-08-19",
    dataSmierci: "1948-01-30",
    wiek: 76,
  },
  {
    id: 6,
    imie: "Johannes",
    nazwisko: "Gutenberg",
    zdjecie:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Gutenberg.jpg/283px-Gutenberg.jpg",
    biografia: "Johannes Gutenberg wynalazł technologię druku, zmieniając sposób rozpowszechniania wiedzy.",
    narodowosc: "Niemiecka",
    dataUrodzenia: "1400-01-01",
    dataSmierci: "1468-02-03",
    wiek: 68,
  },
  {
    id: 7,
    imie: "Alexander",
    nazwisko: "Fleming",
    zdjecie:
      "https://upload.wikimedia.org/wikipedia/commons/b/bf/Synthetic_Production_of_Penicillin_TR1468.jpg",
    biografia: "Alexander Fleming odkrył penicylinę, pierwszy antybiotyk ratujący życie.",
    narodowosc: "Szkocka",
    dataUrodzenia: "1881-08-06",
    dataSmierci: "1955-03-11",
    wiek: 73,
  },
  {
    id: 8,
    imie: "Charles",
    nazwisko: "Babbage",
    zdjecie:
      "https://upload.wikimedia.org/wikipedia/commons/8/82/CharlesBabbage.jpg",
    biografia: "Charles Babbage stworzył koncepcję maszyny analitycznej, prekursora komputerów.",
    narodowosc: "Brytyjska",
    dataUrodzenia: "1791-12-26",
    dataSmierci: "1871-10-18",
    wiek: 79,
  },
  {
    id: 9,
    imie: "Philo",
    nazwisko: "Farnsworth",
    zdjecie:
      "https://upload.wikimedia.org/wikipedia/commons/8/8d/Philo_T._Farnsworth_in_1936.jpg",
    biografia: "Philo Farnsworth opracował technologie telewizyjne w latach 20. XX wieku.",
    narodowosc: "Amerykańska",
    dataUrodzenia: "1906-08-19",
    dataSmierci: "1971-03-11",
    wiek: 64,
  },
  {
    id: 10,
    imie: "James",
    nazwisko: "Watt",
    zdjecie:
      "https://upload.wikimedia.org/wikipedia/commons/2/2c/James_Watt_by_Henry_Howard.jpg",
    biografia: "James Watt wynalazł ulepszony silnik parowy, napędzając rewolucję przemysłową.",
    narodowosc: "Szkocka",
    dataUrodzenia: "1736-01-19",
    dataSmierci: "1819-08-25",
    wiek: 83,
  },
];

export default tworcy;
