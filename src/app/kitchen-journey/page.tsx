"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import {
  fetchKitchenJourneyData,
  adminSetUserPoints,
  fetchUserProgress,
} from "~/app/_actions/gamification";
import { fetchMyRecentCookingSessions } from "~/app/_actions/cookingHistory";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { Progress } from "~/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Trophy,
  Award,
  Star,
  Clock,
  ChefHat,
  Settings,
} from "lucide-react";
import {
  BADGE_DEFINITIONS,
} from "~/server/gamification/badgeDefinitions";

interface JourneyBadge {
  id: number;
  badgeName: string;
  earnedAt: Date | string;
}

interface RecentCook {
  id: number;
  rating: number;
  cookedAt: Date | string;
  recipeName: string;
  recipeSlug: string;
}

/**
 * Kitchen Journey dashboard wired to real progress, badges, and cook history.
 */
const KitchenJourney = (): JSX.Element => {
  const [userProgress, setUserProgress] = useState({
    xp: 0,
    level: 1,
    nextLevelXp: 100,
    checkInCount: 0,
    totalPoints: 0,
  });
  const [badges, setBadges] = useState<JourneyBadge[]>([]);
  const [recentCooks, setRecentCooks] = useState<RecentCook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);
  const [targetUserId, setTargetUserId] = useState("");
  const [pointsToSet, setPointsToSet] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [recentUsers, setRecentUsers] = useState<string[]>([]);

  const { user } = useUser();

  const getRankTitle = (level: number): string => {
    if (level >= 10) return "Culinary Master";
    if (level >= 7) return "Kitchen Virtuoso";
    if (level >= 5) return "Culinary Expert";
    if (level >= 3) return "Kitchen Enthusiast";
    return "Cooking Novice";
  };

  const getLevelPercentage = (): number => {
    return Math.min(
      100,
      Math.round((userProgress.xp / userProgress.nextLevelXp) * 100),
    );
  };

  const nextBadge = BADGE_DEFINITIONS.find(
    (badge) =>
      badge.checkInThreshold !== null &&
      userProgress.checkInCount < badge.checkInThreshold,
  );

  useEffect(() => {
    async function loadUserProgress() {
      try {
        const [journey, sessions] = await Promise.all([
          fetchKitchenJourneyData(),
          fetchMyRecentCookingSessions(8),
        ]);

        setUserProgress({
          xp: journey.progress.xp,
          level: journey.progress.level,
          nextLevelXp: journey.progress.nextLevelXp,
          checkInCount: journey.checkInCount,
          totalPoints: journey.points,
        });
        setBadges(journey.badges);
        setRecentCooks(sessions);

        if (user?.publicMetadata?.role === "admin") {
          setIsAdmin(true);
          if (user?.id) {
            setTargetUserId(user.id);
            setPointsToSet(journey.points);
          }
          const savedRecentUsers = localStorage.getItem("recentUserIds");
          if (savedRecentUsers) {
            setRecentUsers(JSON.parse(savedRecentUsers) as string[]);
          }
        }
      } catch (error) {
        console.error("Error loading user progress:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      void loadUserProgress();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleSetPoints = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!targetUserId.trim()) {
      toast.error("Please enter a user ID");
      return;
    }

    try {
      setIsUpdating(true);
      await adminSetUserPoints(targetUserId, pointsToSet);
      toast.success(
        `Updated points for user ${targetUserId} to ${pointsToSet}`,
      );

      if (targetUserId === user?.id) {
        const progress = await fetchUserProgress();
        setUserProgress((prev) => ({ ...prev, ...progress }));
      }

      if (!recentUsers.includes(targetUserId)) {
        const updated = [
          targetUserId,
          ...recentUsers.filter((uid) => uid !== targetUserId).slice(0, 3),
        ];
        setRecentUsers(updated);
        localStorage.setItem("recentUserIds", JSON.stringify(updated));
      }
    } catch (error) {
      toast.error(`Failed to update points: ${(error as Error).message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user && !isLoading) {
    return (
      <div className="container max-w-3xl py-16 text-center">
        <h1 className="font-display text-3xl font-semibold">Kitchen Journey</h1>
        <p className="mt-3 text-muted-foreground">
          Sign in to track your cooks, XP, and badges.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">Loading your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-8">
      <h1 className="mb-6 text-center font-display text-3xl font-semibold">
        Your Kitchen Journey
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-4 md:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-primary" />
                {user?.username ?? user?.firstName ?? "Chef"}
              </CardTitle>
              <CardDescription>
                <span className="font-semibold">
                  {getRankTitle(userProgress.level)}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">
                    Level {userProgress.level}
                  </span>
                  <span>
                    {userProgress.xp}/{userProgress.nextLevelXp} XP
                  </span>
                </div>
                <Progress value={getLevelPercentage()} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md bg-muted p-2">
                  <Trophy className="mx-auto mb-1 h-4 w-4" />
                  <div className="text-xl font-bold">{userProgress.level}</div>
                  <div className="text-xs text-muted-foreground">Level</div>
                </div>
                <div className="rounded-md bg-muted p-2">
                  <ChefHat className="mx-auto mb-1 h-4 w-4" />
                  <div className="text-xl font-bold">
                    {userProgress.checkInCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Cooks</div>
                </div>
                <div className="rounded-md bg-muted p-2">
                  <Award className="mx-auto mb-1 h-4 w-4" />
                  <div className="text-xl font-bold">{badges.length}</div>
                  <div className="text-xs text-muted-foreground">Badges</div>
                </div>
              </div>

              <div className="pt-2 text-sm text-muted-foreground">
                {userProgress.totalPoints} total XP earned
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Award className="h-5 w-5 text-accent" />
                Next achievement
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextBadge ? (
                <div className="flex items-center gap-2 text-sm">
                  <Badge
                    variant="outline"
                    className="flex h-8 w-8 items-center justify-center rounded-full p-0"
                  >
                    <Star className="h-4 w-4 text-accent" />
                  </Badge>
                  <div>
                    <p className="font-medium">{nextBadge.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {nextBadge.description} ({userProgress.checkInCount}/
                      {nextBadge.checkInThreshold})
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  You have earned all check-in badges. Keep cooking!
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Link
                href="/kitchen-journey/badges"
                className="text-xs text-primary hover:underline"
              >
                View all badges
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6 md:col-span-2">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="mb-4 grid grid-cols-2">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="achievements">Badges</TabsTrigger>
            </TabsList>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent cooks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentCooks.length > 0 ? (
                    <ul className="space-y-3">
                      {recentCooks.map((cook) => (
                        <li
                          key={cook.id}
                          className="flex items-start gap-3 border-b pb-3 last:border-0"
                        >
                          <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm">
                              Cooked{" "}
                              <Link
                                href={`/recipe/${cook.recipeSlug}`}
                                className="font-medium text-foreground hover:underline"
                              >
                                {cook.recipeName}
                              </Link>{" "}
                              · {cook.rating} stars
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(cook.cookedAt), "MMM d, yyyy")}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      <p>
                        No cooks logged yet. Finish a recipe and tap &quot;I
                        cooked this&quot;.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle>Earned badges</CardTitle>
                </CardHeader>
                <CardContent>
                  {badges.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {badges.map((badge) => (
                        <div
                          key={badge.id}
                          className="flex flex-col items-center text-center"
                        >
                          <Badge className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 p-0 hover:bg-accent/10">
                            <Award className="h-8 w-8" />
                          </Badge>
                          <span className="text-sm font-medium">
                            {badge.badgeName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(badge.earnedAt), "MMM d, yyyy")}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      Log your first cook to earn the First Cook badge.
                    </p>
                  )}

                  <div className="mt-6 text-center">
                    <Link href="/kitchen-journey/badges">
                      <Button variant="outline" size="sm">
                        View all badges
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {isAdmin && (
            <Card className="overflow-hidden border-2 border-accent/40">
              <CardHeader className="bg-accent/10">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Admin Controls
                </CardTitle>
                <CardDescription>Manage user gamification data</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleSetPoints} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="userId"
                      className="block text-sm font-medium"
                    >
                      User ID
                    </label>
                    <Input
                      id="userId"
                      value={targetUserId}
                      onChange={(e) => setTargetUserId(e.target.value)}
                      placeholder="Enter user ID"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="points"
                      className="block text-sm font-medium"
                    >
                      Points total
                    </label>
                    <Input
                      id="points"
                      type="number"
                      value={pointsToSet}
                      onChange={(e) =>
                        setPointsToSet(parseInt(e.target.value, 10) || 0)
                      }
                      min={0}
                      required
                    />
                  </div>
                  {recentUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {recentUsers.map((id) => (
                        <Button
                          key={id}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setTargetUserId(id)}
                        >
                          {id.slice(0, 8)}…
                        </Button>
                      ))}
                    </div>
                  )}
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Set points"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default KitchenJourney;
