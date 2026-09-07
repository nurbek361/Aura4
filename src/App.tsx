/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AchievementsScreen } from './components/AchievementsScreen';
import { BottomNav } from './components/BottomNav';
import { CalendarScreen } from './components/CalendarScreen';
import { CinemaScreen } from './components/CinemaScreen';
import { FinanceScreen } from './components/FinanceScreen';
import { FriendsScreen } from './components/FriendsScreen';
import { Header } from './components/Header';
import { HealthSportScreen } from './components/HealthSportScreen';
import { HomeScreen } from './components/HomeScreen';
import { HubScreen } from './components/HubScreen';
import { LibraryScreen } from './components/LibraryScreen';
import { MusicScreen } from './components/MusicScreen';
import { NavigationDrawer } from './components/NavigationDrawer';
import { NewsScreen } from './components/NewsScreen';
import { ProfileModal } from './components/ProfileModal';
import { RemindersScreen } from './components/RemindersScreen';
import { ShortsScreen } from './components/ShortsScreen';
import { SpiritualityScreen } from './components/SpiritualityScreen';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { AuraAction, NavigationTab } from './types';
import { ambientSound } from './utils/audioSynth';
import { initDailyRecommendations, initExpenseReminders } from './utils/notifications';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Queries the AI assistant pushes into a screen so it opens already
  // searching/playing what was asked for (e.g. "найди Rihanna Rude Boy").
  const [pendingMusicQuery, setPendingMusicQuery] = useState<string | null>(null);
  const [pendingMovieQuery, setPendingMovieQuery] = useState<string | null>(null);

  // Kick off the ~24h AI recommendation notification scheduler once.
  useEffect(() => {
    const cleanup = initDailyRecommendations();
    return cleanup;
  }, []);

  // Nudge the user to log an expense when they return to Aura after being
  // away, and periodically during the day if nothing was logged yet.
  useEffect(() => {
    const cleanup = initExpenseReminders();
    return cleanup;
  }, []);

  const handleSelectTab = (tab: NavigationTab) => {
    ambientSound.playTone(520, 0.08);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Dispatches a structured action coming from the AI assistant — this is
   * what lets Aura actually control the app (navigate, search & play a
   * song/movie) instead of only describing what it would do.
   */
  const handleAuraAction = (action: AuraAction) => {
    switch (action.type) {
      case 'open_screen':
        handleSelectTab(action.screen);
        break;
      case 'play_music':
        setPendingMusicQuery(action.query);
        handleSelectTab('music');
        break;
      case 'search_movie':
        setPendingMovieQuery(action.query);
        handleSelectTab('cinema');
        break;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#10131a] text-[#e1e2ec] flex flex-col items-center justify-start overflow-x-hidden font-sans selection:bg-[#a078ff]/30 selection:text-[#d0bcff]">
      {/* Fixed Frosted Header with Menu Toggle */}
      <Header
        currentTab={currentTab}
        userName="Нурбек"
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenMenu={() => setIsDrawerOpen(true)}
      />

      {/* Main Single Column Fluid Shell (max-w-[480px] to match mobile screenshot proportions exactly) */}
      <main className="w-full max-w-[480px] flex-1 flex flex-col relative px-4 sm:px-5 pt-20 pb-28">
        {currentTab === 'home' && (
          <HomeScreen
            onOpenVoice={() => setIsVoiceModalOpen(true)}
            onNavigateTab={handleSelectTab}
          />
        )}

        {currentTab === 'cinema' && (
          <CinemaScreen
            onOpenVoice={() => setIsVoiceModalOpen(true)}
            initialQuery={pendingMovieQuery}
            onInitialQueryConsumed={() => setPendingMovieQuery(null)}
          />
        )}

        {currentTab === 'music' && (
          <MusicScreen
            initialQuery={pendingMusicQuery}
            onInitialQueryConsumed={() => setPendingMusicQuery(null)}
          />
        )}

        {currentTab === 'hub' && <HubScreen onSelectTab={handleSelectTab} />}

        {currentTab === 'calendar' && (
          <CalendarScreen onBackToHome={() => handleSelectTab('home')} />
        )}

        {currentTab === 'reminders' && <RemindersScreen />}

        {currentTab === 'finance' && <FinanceScreen />}

        {currentTab === 'health' && <HealthSportScreen />}

        {currentTab === 'library' && <LibraryScreen />}

        {currentTab === 'spirituality' && <SpiritualityScreen />}

        {currentTab === 'achievements' && <AchievementsScreen />}

        {currentTab === 'friends' && <FriendsScreen />}

        {currentTab === 'shorts' && <ShortsScreen />}

        {currentTab === 'news' && <NewsScreen />}
      </main>

      {/* Slide-out Categories Navigation Drawer */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
      />

      {/* Floating Bottom Nav Dock */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
        isVoiceActive={isVoiceModalOpen}
      />

      {/* Voice Assistant Interactive Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onExecuteCommand={handleAuraAction}
      />

      {/* Profile / System Info Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
      />
    </div>
  );
}
