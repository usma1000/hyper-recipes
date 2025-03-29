"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  fetchUserProgress,
  adminSetUserPoints,
} from "~/app/_actions/gamification";
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
  BookOpen,
  Heart,
  ChefHat,
  Settings,
} from "lucide-react";

const KitchenJourney = () => {
  // User progress state
  const [userProgress, setUserProgress] = useState({
    xp: 0,
    level: 1,
    nextLevelXp: 100,
    recipesCreated: 0,
    recipesFavorited: 0,
    streakDays: 0,
  });
  const [badges, setBadges] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Admin form state
  const [isAdmin, setIsAdmin] = useState(false);
  const [targetUserId, setTargetUserId] = useState("");
  const [pointsToSet, setPointsToSet] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [recentUsers, setRecentUsers] = useState<string[]>([]);

  const { user } = useUser();

  const getRankTitle = (level: number) => {
    if (level >= 10) return "Culinary Master";
    if (level >= 7) return "Kitchen Virtuoso";
    if (level >= 5) return "Culinary Expert";
    if (level >= 3) return "Kitchen Enthusiast";
    return "Cooking Novice";
  };

  const getLevelPercentage = () => {
    return Math.min(
      100,
      Math.round((userProgress.xp / userProgress.nextLevelXp) * 100),
    );
  };

  useEffect(() => {
    async function loadUserProgress() {
      try {
        // Load progress from API
        const progress = await fetchUserProgress();

        // Extend with additional stats that would come from actual API
        const enhancedProgress = {
          ...progress,
          recipesCreated: 5,
          recipesFavorited: 8,
          streakDays: 3,
        };

        setUserProgress(enhancedProgress);

        // Fetch badges and activity (placeholder)
        const savedBadges = JSON.parse(localStorage.getItem("badges") || "[]");
        const savedActivity = JSON.parse(
          localStorage.getItem("recentActivity") || "[]",
        );

        setBadges(savedBadges);
        setRecentActivity([
          "Created a new recipe: Chocolate Chip Cookies",
          "Earned the 'First Recipe' badge",
          "Reached Level 2!",
          "Favorited Spaghetti Carbonara",
          "Logged in 3 days in a row!",
        ]);

        // Check if user is admin directly from publicMetadata
        if (user?.publicMetadata?.role === "admin") {
          setIsAdmin(true);

          // Set current user ID in the form
          if (user?.id) {
            setTargetUserId(user.id);
            // Pre-fill with current points
            setPointsToSet(progress.xp);
          }

          // Load recent users from localStorage
          const savedRecentUsers = localStorage.getItem("recentUserIds");
          if (savedRecentUsers) {
            setRecentUsers(JSON.parse(savedRecentUsers));
          }
        }
      } catch (error) {
        console.error("Error loading user progress:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      loadUserProgress();
    }
  }, [user]);

  // Admin handler to update points - update to refresh TopNav
  const handleSetPoints = async (e: React.FormEvent) => {
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

      // If updating own points, refresh the display
      if (targetUserId === user?.id) {
        const progress = await fetchUserProgress();
        setUserProgress({ ...userProgress, ...progress });
      }

      // Save to recent users
      saveToRecentUsers(targetUserId);
    } catch (error) {
      toast.error(`Failed to update points: ${(error as Error).message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Save a user ID to the recent users list
  const saveToRecentUsers = (id: string) => {
    if (!id || recentUsers.includes(id)) return;

    const updatedRecentUsers = [
      id,
      ...recentUsers.filter((uid) => uid !== id).slice(0, 3),
    ]; // Keep max 4 users
    setRecentUsers(updatedRecentUsers);
    localStorage.setItem("recentUserIds", JSON.stringify(updatedRecentUsers));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-8">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Your Kitchen Journey
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Sidebar */}
        <div className="space-y-4 md:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-primary" />
                {user?.username || user?.firstName || "Chef"}
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
                  <BookOpen className="mx-auto mb-1 h-4 w-4" />
                  <div className="text-xl font-bold">
                    {userProgress.recipesCreated}
                  </div>
                  <div className="text-xs text-muted-foreground">Recipes</div>
                </div>
                <div className="rounded-md bg-muted p-2">
                  <Heart className="mx-auto mb-1 h-4 w-4" />
                  <div className="text-xl font-bold">
                    {userProgress.recipesFavorited}
                  </div>
                  <div className="text-xs text-muted-foreground">Favorites</div>
                </div>
              </div>

              <div className="pt-2">
                <div className="mb-1 text-sm font-medium">Current Streak</div>
                <div className="flex items-center gap-1 text-amber-600">
                  <Clock className="h-4 w-4" />
                  <span className="font-bold">
                    {userProgress.streakDays} days
                  </span>
                  <span className="text-xs text-muted-foreground">
                    &middot; Keep cooking!
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Award className="h-5 w-5 text-amber-500" />
                Next Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="flex h-8 w-8 items-center justify-center rounded-full p-0"
                  >
                    <Star className="h-4 w-4 text-amber-500" />
                  </Badge>
                  <span>Create 5 more recipes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="flex h-8 w-8 items-center justify-center rounded-full p-0"
                  >
                    <Star className="h-4 w-4 text-amber-500" />
                  </Badge>
                  <span>Maintain a 7-day streak</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link
                href="/kitchen-journey/badges"
                className="text-xs text-primary hover:underline"
              >
                View all achievements
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6 md:col-span-2">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="mb-4 grid grid-cols-3">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="achievements">Badges</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
            </TabsList>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.length > 0 ? (
                    <ul className="space-y-3">
                      {recentActivity.map((activity, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 border-b pb-3 last:border-0"
                        >
                          <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm">{activity}</p>
                            <span className="text-xs text-muted-foreground">
                              {index === 0
                                ? "Just now"
                                : index === 1
                                  ? "Yesterday"
                                  : `${index + 1} days ago`}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      <p>
                        No activity recorded yet. Try creating or favoriting a
                        recipe!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Badges Tab */}
            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle>Earned Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Sample badges - dynamically generated based on actual badges */}
                    <div className="flex flex-col items-center text-center">
                      <Badge className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-amber-600 p-0 hover:bg-amber-700">
                        <Award className="h-8 w-8" />
                      </Badge>
                      <span className="text-sm font-medium">First Recipe</span>
                      <span className="text-xs text-muted-foreground">
                        Unlocked
                      </span>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <Badge className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-amber-600 p-0 hover:bg-amber-700">
                        <Star className="h-8 w-8" />
                      </Badge>
                      <span className="text-sm font-medium">Level 2</span>
                      <span className="text-xs text-muted-foreground">
                        Unlocked
                      </span>
                    </div>

                    {/* Locked badge example */}
                    <div className="flex flex-col items-center text-center opacity-50">
                      <Badge
                        variant="outline"
                        className="mb-2 flex h-16 w-16 items-center justify-center rounded-full p-0"
                      >
                        <Trophy className="h-8 w-8" />
                      </Badge>
                      <span className="text-sm font-medium">Expert Chef</span>
                      <span className="text-xs text-muted-foreground">
                        Reach level 10
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <Link href="/kitchen-journey/badges">
                      <Button variant="outline" size="sm">
                        View All Badges
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rewards Tab */}
            <TabsContent value="rewards">
              <Card>
                <CardHeader>
                  <CardTitle>Rewards &amp; Unlocks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-dashed bg-muted p-4">
                      <h3 className="mb-1 font-semibold">Pro Features</h3>
                      <p className="mb-2 text-sm text-muted-foreground">
                        Reach Level 5 to unlock premium recipe formats
                      </p>
                      <Progress
                        value={Math.min(100, (userProgress.level / 5) * 100)}
                        className="h-2"
                      />
                      <p className="mt-1 text-right text-xs text-muted-foreground">
                        {userProgress.level}/5 Levels
                      </p>
                    </div>

                    <div className="rounded-lg border border-dashed bg-muted p-4">
                      <h3 className="mb-1 font-semibold">Custom Themes</h3>
                      <p className="mb-2 text-sm text-muted-foreground">
                        Create 10 recipes to unlock custom theme options
                      </p>
                      <Progress
                        value={Math.min(
                          100,
                          (userProgress.recipesCreated / 10) * 100,
                        )}
                        className="h-2"
                      />
                      <p className="mt-1 text-right text-xs text-muted-foreground">
                        {userProgress.recipesCreated}/10 Recipes
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Admin Panel */}
          {isAdmin && (
            <Card className="overflow-hidden border-2 border-amber-200">
              <CardHeader className="bg-amber-50">
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="points"
                        className="block text-sm font-medium"
                      >
                        Total XP Points
                      </label>
                      <Input
                        id="points"
                        type="number"
                        min="0"
                        value={pointsToSet}
                        onChange={(e) =>
                          setPointsToSet(parseInt(e.target.value) || 0)
                        }
                        placeholder="Enter new point value"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-muted-foreground">
                        Calculated Level
                      </label>
                      <div className="flex h-10 items-center rounded-md border bg-muted/50 px-3 py-2">
                        {Math.floor(Math.sqrt(pointsToSet / 25)) + 1}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full"
                  >
                    {isUpdating ? "Updating..." : "Update User Points"}
                  </Button>
                </form>
              </CardContent>

              {recentUsers.length > 0 && (
                <CardFooter className="flex-col items-start border-t bg-muted/50 pt-4">
                  <p className="mb-2 text-sm font-medium">Recent Users</p>
                  <div className="flex flex-wrap gap-2">
                    {recentUsers.map((id) => (
                      <Badge
                        key={id}
                        variant="outline"
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => setTargetUserId(id)}
                      >
                        {id === user?.id ? "Me" : id.substring(0, 8) + "..."}
                      </Badge>
                    ))}
                  </div>
                </CardFooter>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default KitchenJourney;
