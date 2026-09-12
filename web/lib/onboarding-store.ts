'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SportKey } from '@/lib/sports-config';

export type Experience = 'casual' | 'sharp' | 'research';

interface OnboardingState {
  done: boolean;
  ageConfirmed: boolean;
  sports: SportKey[];
  experience: Experience | null;
  unitCents: number;
  bankrollCents: number;
  responsible: boolean;
  setAge: (v: boolean) => void;
  toggleSport: (s: SportKey) => void;
  setExperience: (e: Experience) => void;
  setUnit: (c: number) => void;
  setBankroll: (c: number) => void;
  setResponsible: (v: boolean) => void;
  finish: () => void;
}

export const useOnboarding = create<OnboardingState>()(
  persist(
    (set) => ({
      done: false,
      ageConfirmed: false,
      sports: [],
      experience: null,
      unitCents: 1000,
      bankrollCents: 100000,
      responsible: false,
      setAge: (ageConfirmed) => set({ ageConfirmed }),
      toggleSport: (s) =>
        set((st) => ({
          sports: st.sports.includes(s)
            ? st.sports.filter((x) => x !== s)
            : [...st.sports, s],
        })),
      setExperience: (experience) => set({ experience }),
      setUnit: (unitCents) => set({ unitCents }),
      setBankroll: (bankrollCents) => set({ bankrollCents }),
      setResponsible: (responsible) => set({ responsible }),
      finish: () => set({ done: true }),
    }),
    { name: 'betedge-onboarding' },
  ),
);
