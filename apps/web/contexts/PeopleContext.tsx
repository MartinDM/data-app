'use client';

import { Person } from '@/app/types/person';
import {
    createContext,
    ReactNode,
    useContext,
    useMemo,
    useState,
} from 'react';
import { createPeople } from '../../web/app/utils/helpers';

type PeopleContextType = {
    people: Person[];
    getPersonById: (id: string) => Person | undefined;
    refresh: () => void;
};
const PeopleContext = createContext<PeopleContextType | undefined>(undefined);

export function PeopleProvider({ children }: { children: ReactNode }) {
    const [people, setPeople] = useState<Person[]>(() => createPeople(100));

    const refresh = () => setPeople(createPeople(100));
    const getPersonById = (id: string) => people.find(p => p.id === id);

    const value = useMemo(
        () => ({ people, getPersonById, refresh }),
        [people]
    );

    return <PeopleContext.Provider value={value}>{children}</PeopleContext.Provider>;
}

export function usePeople() {
    const ctx = useContext(PeopleContext);
    if (!ctx) throw new Error('usePeople must be used within a PeopleProvider');
    return ctx;
}
