import axios from 'axios';

import { attributes } from '../models/attributes';

export interface IAuctionsAPI {
  bin: boolean; // Indicate if auction or BIN
  category: string;
  claimed: boolean; // Indicate if the auction is active
  highest_bid_amount: number; // Price of auctions
  item_lore: string;
  item_name: string;
  starting_bid: number; // Price for BIN
  tier: string;
  uuid: string;
}

export interface IAuction {
  attributes: Record<string, number>;
  bin: boolean;
  category: string;
  highest_bid_amount: number;
  itemName: string;
  rawItemName: string;
  startingBid: number;
  tier: string;
  uuid: string;
}

interface IAuctionsAPIPaginatedResponse {
  auctions: IAuctionsAPI[];
  lastUpdated: number;
  page: number;
  success: boolean;
  totalAuctions: number;
  totalPages: number;
}

const getPageAuctionsRequests = async (page: number): Promise<IAuctionsAPIPaginatedResponse['auctions']> => {
  const pageDataResponse = await axios.get<IAuctionsAPIPaginatedResponse>(`https://api.hypixel.net/skyblock/auctions?page=${page}`);
  const pageData = pageDataResponse.data;

  if (pageData?.success) {
    return pageData.auctions.filter((auction) => !auction.claimed);
  }

  return Promise.reject(new Error('No results'));
};

export const getAuctionData = (): Promise<IAuctionsAPI[]> => {
  return axios
    .get<IAuctionsAPIPaginatedResponse>('https://api.hypixel.net/skyblock/auctions')
    .then((response) => response.data)
    .then((data) => {
      if (!data?.success) {
        throw new Error('Invalid query to auctions');
      }

      const auctions = data.auctions;

      const promises: Promise<IAuctionsAPIPaginatedResponse['auctions']>[] = [];

      if (data.totalPages > 1) {
        for (let page = 1; page < data.totalPages; page++) {
          promises.push(getPageAuctionsRequests(page));
        }
      }
      return Promise.all(promises).then((results) => {
        auctions.push(...results.flat());

        return auctions;
      });
    });
};

const romanToNumber = (roman: string): number => {
  switch (roman) {
    case 'I':
      return 1;
    case 'II':
      return 2;
    case 'III':
      return 3;
    case 'IV':
      return 4;
    case 'IX':
      return 9;
    case 'V':
      return 5;
    case 'VI':
      return 6;
    case 'VII':
      return 7;
    case 'VIII':
      return 8;
    case 'X':
      return 10;
    default:
      return -1;
  }
};

const reforges = [
  'Ambered',
  'Ancient',
  'Astute',
  'Auspicious',
  'Awkward',
  'Blazing',
  'Blended',
  'Blessed',
  'Blood-Soaked',
  'Blooming',
  'Bountiful',
  'Brilliant',
  'Bulky',
  'Bustling',
  'Chomp',
  'Clean',
  'Coldfused',
  'Colossal',
  'Cubic',
  'Deadly',
  'Dirty',
  'Double-Bit',
  'Empowered',
  'Epic',
  'Excellent',
  'Fabled',
  'Fair',
  'Fanged',
  'Fast',
  'Festive',
  'Fierce',
  'Fine',
  'Fleet',
  'Fortified',
  'Fortunate',
  'Fruitful',
  'Gentle',
  'Gilded',
  'Glistening',
  'Grand',
  'Great',
  'Green Thumb',
  'Hasty',
  'Headstrong',
  'Heated',
  'Hefty',
  'Heroic',
  'Honored',
  'Hyper',
  'Jaded',
  'Legendary',
  'Loving',
  'Lucky',
  "Lumberjack's",
  'Lush',
  'Magnetic',
  'Menacing',
  'Mithraic',
  'Moil',
  'Mossy',
  'Mythic',
  'Neat',
  'Necrotic',
  'Odd',
  "Peasant's",
  "Pitchin'",
  'Precise',
  "Prospector's",
  'Pure',
  'Rapid',
  'Reinforced',
  'Renowned',
  'Rich',
  'Ridiculous',
  'Robust',
  'Rooted',
  'Royal',
  'Rugged',
  'Salty',
  'Sharp',
  'Smart',
  'Snowy',
  'Soft',
  'Spicy',
  'Spiked',
  'Spiritual',
  'Stained',
  'Stellar',
  'Stiff',
  'Strenghtened',
  'Sturdy',
  'Submerged',
  'Suspicious',
  'Thick',
  'Titanic',
  'Toil',
  'Treacherous',
  'Unreal',
  'Unyielding',
  'Warped',
  'Waxed',
  'Withered',
  'Zooming'
];

const cleanAuctionName = (name: string): string => {
  let cleanedName = name;

  cleanedName = cleanedName.replace(/✪/g, '');
  cleanedName = cleanedName.replace(/◆/g, '');
  cleanedName = cleanedName.replace(/➊/g, '');
  cleanedName = cleanedName.replace(/➋/g, '');
  cleanedName = cleanedName.replace(/➌/g, '');
  cleanedName = cleanedName.replace(/➍/g, '');
  cleanedName = cleanedName.replace(/➎/g, '');
  cleanedName = cleanedName.replace(/✦/g, '');
  cleanedName = cleanedName.replace(/✿/g, '');
  cleanedName = cleanedName.replace(/⚚/g, '');

  cleanedName = cleanedName.replace(/\[Lvl \d+\]/g, '');
  cleanedName = cleanedName.replace(/\[\d+✦\]/g, '');
  cleanedName = cleanedName.replace(/\[\d+\]/g, '');
  cleanedName = cleanedName.replace(/\(Year \d+\)/g, '');

  cleanedName = cleanedName.trim();

  if (cleanedName.includes('Backpack')) {
    return cleanedName;
  }

  if (cleanedName.includes('Wise Dragon')) {
    cleanedName = cleanedName.replace('Very ', '');
  } else {
    cleanedName = cleanedName.replace('Wise ', '');
  }

  if (
    cleanedName.includes('Super Heavy Helmet') ||
    cleanedName.includes('Super Heavy Chestplate') ||
    cleanedName.includes('Super Heavy Leggings') ||
    cleanedName.includes('Super Heavy Boots')
  ) {
    cleanedName = cleanedName.replace('Thicc ', '');
  } else if (
    cleanedName.includes('Heavy Helmet') ||
    cleanedName.includes('Heavy Chestplate') ||
    cleanedName.includes('Heavy Leggings') ||
    cleanedName.includes('Heavy Boots')
  ) {
    cleanedName = cleanedName.replace('Extremely ', '');
    cleanedName = cleanedName.replace('Not So ', '');
  } else {
    cleanedName = cleanedName.replace('Heavy ', '');
    cleanedName = cleanedName.replace('Light ', '');
  }

  if (
    cleanedName.includes('Perfect Helmet') ||
    cleanedName.includes('Perfect Chestplate') ||
    cleanedName.includes('Perfect Leggings') ||
    cleanedName.includes('Perfect Boots')
  ) {
    cleanedName = cleanedName.replace('Absolutely ', '');
  } else {
    cleanedName = cleanedName.replace('Perfect ', '');
  }

  if (cleanedName.includes('Refined Mithril Pickaxe')) {
    cleanedName = cleanedName.replace('Even More ', '');
  } else {
    cleanedName = cleanedName.replace('Refined ', '');
  }

  if (!cleanedName.includes("Giant's Sword")) {
    cleanedName = cleanedName.replace('Giant ', '');
  }

  reforges.forEach((reforge) => {
    if (cleanedName.startsWith(reforge)) {
      cleanedName = cleanedName.replace(reforge, '');
    }
  });

  return cleanedName.trim();
};

export const rawAuctionToAuction = (rawAuction: IAuctionsAPI): IAuction => {
  const auction: IAuction = {
    attributes: {},
    bin: rawAuction.bin,
    category: rawAuction.category,
    highest_bid_amount: rawAuction.highest_bid_amount,
    itemName: cleanAuctionName(rawAuction.item_name),
    rawItemName: rawAuction.item_name,
    startingBid: rawAuction.starting_bid,
    tier: rawAuction.tier,
    uuid: rawAuction.uuid
  };

  const loreLines = rawAuction.item_lore.split('\n');

  loreLines.forEach((line) => {
    // eslint-disable-next-line sonarjs/regular-expr -- Safe
    const match = /^§[0-9a-f]([a-z ]+) ([IVX]+)/i.exec(line);
    if (match) {
      const [, attribute, levelRoman] = match;
      const level = romanToNumber(levelRoman);

      if (attributes.includes(attribute) && level !== -1) {
        auction.attributes[attribute] = level;
      }
    }
  });

  return auction;
};
