import { useCpl } from './useCpl';
import { siteCopy } from '../data/siteCopy';

export function useSiteCopy() {
  const { language } = useCpl();
  return siteCopy[language] || siteCopy.EN;
}
