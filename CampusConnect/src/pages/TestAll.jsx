import React from "react";
import {
  Navbar,
  DarkModeToggle,
  AccessibilityMenu,
  LanguageSelector,

  PostCard,
  CreatePost,
  ReactionBar,
  StoryRing,
  AnonymousPost,
  InfiniteScroll,

  ChatWindow,
  ChatMessage,

  ProfileCard,
  UserList,
  AchievementBadge,

  EventCard,
  EmergencyBanner,
  DiningHallCard,
  LostFoundCard,

  CourseCard,
  ProfessorCard,
  TutorCard,
  StudyGroupCard,
  NoteCard,

  MarketplaceItem,
  GroupCard,

  LoadingSpinner,
  SkeletonLoader,
  ConfirmModal,
  CountdownTimer,
  ImageUpload,
  ImageGallery,
  PollWidget,
  SearchFilter,
  SortDropdown,
  MapPin,
  NotificationItem

} from "../components";

export default function TestAll() {
  return (
    <div style={{ padding: "20px" }}>
      <h1> Campus Connect Component Test</h1>

      <h2>Layout</h2>
      <Navbar />
      <DarkModeToggle />
      <AccessibilityMenu />
      <LanguageSelector />

      <hr />

      <h2>Social</h2>
      <PostCard />
      <CreatePost />
      <ReactionBar />
      <StoryRing />
      <AnonymousPost />
      <InfiniteScroll fetchMore={() => {}} hasMore={true}>
        <p>Scroll test</p>
      </InfiniteScroll>

      <hr />

      <h2>Chat</h2>
      <ChatWindow />
      <ChatMessage message="Test message" />

      <hr />

      <h2>Profile</h2>
      <ProfileCard />
      <UserList />
      <AchievementBadge />

      <hr />

      <h2>Campus</h2>
      <EventCard />
      <EmergencyBanner />
      <DiningHallCard />
      <LostFoundCard />
      <MapPin />
      <NotificationItem />

      <hr />

      <h2>Learning</h2>
      <CourseCard />
      <ProfessorCard />
      <TutorCard />
      <StudyGroupCard />
      <NoteCard />

      <hr />

      <h2>Marketplace</h2>
      <MarketplaceItem />
      <GroupCard />

      <hr />

      <h2>UI</h2>
      <LoadingSpinner />
      <SkeletonLoader />
      <ConfirmModal />
      <CountdownTimer />
      <ImageUpload />
      <ImageGallery />
      <PollWidget />
      <SearchFilter />
      <SortDropdown />
    </div>
  );
}