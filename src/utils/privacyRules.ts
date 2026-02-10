/**
 * Privacy rules for data access based on user type and premium status.
 * 
 * Rules:
 * - FREE users: Can see name, photo, position, nationality. NO email/phone/videos.
 * - Premium ATHLETE: Can see clubs/coaches/agents data, but NOT other athletes' data.
 * - Premium CLUB/COACH/AGENT: Full access to athlete data (email/phone/videos).
 * - Own profile: Always full access.
 * - Admin: Always full access.
 */

export type ViewerType = 'player' | 'club' | 'agent' | 'coach' | null;

interface AccessCheckParams {
  viewerType: ViewerType;
  viewerIsPremium: boolean;
  viewerIsAdmin: boolean;
  isOwnProfile: boolean;
  targetType: 'player' | 'club' | 'agent' | 'coach';
}

export function canViewContactData(params: AccessCheckParams): boolean {
  const { viewerType, viewerIsPremium, viewerIsAdmin, isOwnProfile, targetType } = params;

  // Own profile or admin always has access
  if (isOwnProfile || viewerIsAdmin) return true;

  // Not premium = no access
  if (!viewerIsPremium) return false;

  // Premium athlete cannot see other athletes' contact data
  if (viewerType === 'player' && targetType === 'player') return false;

  // Premium non-athlete can see athlete data
  // Premium athlete can see club/coach/agent data
  return true;
}

export function canViewVideos(params: AccessCheckParams): boolean {
  return canViewContactData(params);
}

export function canSendMessage(params: AccessCheckParams): boolean {
  const { viewerType, viewerIsPremium, viewerIsAdmin, isOwnProfile, targetType } = params;

  if (isOwnProfile) return false; // Can't message yourself
  if (viewerIsAdmin) return true;
  if (!viewerIsPremium) return false;

  // Athletes can't message other athletes
  if (viewerType === 'player' && targetType === 'player') return false;

  return true;
}
