import { cloneElement, isValidElement, Fragment } from 'react';

export function appendKeyToValidElement(element: Fragment, key: number): Fragment {
  if (isValidElement(element) && element.key === null) {
    return cloneElement(element, { key });
  }
  return element;
}
