import React from "react";
import { Button } from "../components/ui/button";
import { User, Mail, Calendar, Trophy, Laptop, ThumbsUp, MessageCircle, Clock, Settings } from "lucide-react";

const Profile = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>

      {/* Profile Header */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-green-600">
              <User className="h-12 w-12 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Alex Reader</h2>
            <p className="text-muted-foreground">Sports & Tech Enthusiast</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Member since January 2024
            </p>
          </div>
          <Button>Edit Profile</Button>
        </div>
      </div>

      {/* Reading Statistics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-xl font-semibold">Reading Statistics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Trophy className="h-5 w-5 text-blue-500" />
                <span className="text-muted-foreground">Sports Articles Read</span>
              </div>
              <span className="font-semibold">47</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Laptop className="h-5 w-5 text-green-500" />
                <span className="text-muted-foreground">Tech Articles Read</span>
              </div>
              <span className="font-semibold">32</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-purple-500" />
                <span className="text-muted-foreground">Total Reading Time</span>
              </div>
              <span className="font-semibold">12.5 hours</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ThumbsUp className="h-5 w-5 text-yellow-500" />
                <span className="text-muted-foreground">Articles Upvoted</span>
              </div>
              <span className="font-semibold">156</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-xl font-semibold">Engagement</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-blue-500" />
                <span className="text-muted-foreground">Comments Made</span>
              </div>
              <span className="font-semibold">23</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-green-500" />
                <span className="text-muted-foreground">Days Active</span>
              </div>
              <span className="font-semibold">28</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Trophy className="h-5 w-5 text-purple-500" />
                <span className="text-muted-foreground">Favorite Category</span>
              </div>
              <span className="font-semibold">Sports</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Laptop className="h-5 w-5 text-yellow-500" />
                <span className="text-muted-foreground">Reading Streak</span>
              </div>
              <span className="font-semibold">7 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Preferences */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-4 text-xl font-semibold">Reading Preferences</h3>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-sm text-blue-800 dark:text-blue-200">
            NBA
          </span>
          <span className="rounded-full bg-green-100 dark:bg-green-900 px-3 py-1 text-sm text-green-800 dark:text-green-200">
            NFL
          </span>
          <span className="rounded-full bg-purple-100 dark:bg-purple-900 px-3 py-1 text-sm text-purple-800 dark:text-purple-200">
            Soccer
          </span>
          <span className="rounded-full bg-yellow-100 dark:bg-yellow-900 px-3 py-1 text-sm text-yellow-800 dark:text-yellow-200">
            AI
          </span>
          <span className="rounded-full bg-red-100 dark:bg-red-900 px-3 py-1 text-sm text-red-800 dark:text-red-200">
            Startups
          </span>
          <span className="rounded-full bg-indigo-100 dark:bg-indigo-900 px-3 py-1 text-sm text-indigo-800 dark:text-indigo-200">
            Tech News
          </span>
          <span className="rounded-full bg-pink-100 dark:bg-pink-900 px-3 py-1 text-sm text-pink-800 dark:text-pink-200">
            Innovation
          </span>
          <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm text-gray-800 dark:text-gray-200">
            Breaking News
          </span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-4 text-xl font-semibold">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 rounded-lg bg-muted/50 p-4">
            <div className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400"></div>
            <div className="flex-1">
              <p className="font-medium">Read "Lakers Pull Off Stunning Comeback"</p>
              <p className="text-sm text-muted-foreground">
                Sports • 5 min read
              </p>
            </div>
            <span className="text-sm text-muted-foreground">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-4 rounded-lg bg-muted/50 p-4">
            <div className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400"></div>
            <div className="flex-1">
              <p className="font-medium">Upvoted "OpenAI Announces GPT-5"</p>
              <p className="text-sm text-muted-foreground">
                Tech • 8 min read
              </p>
            </div>
            <span className="text-sm text-muted-foreground">4 hours ago</span>
          </div>
          <div className="flex items-center space-x-4 rounded-lg bg-muted/50 p-4">
            <div className="h-2 w-2 rounded-full bg-yellow-500 dark:bg-yellow-400"></div>
            <div className="flex-1">
              <p className="font-medium">Commented on "Tesla's Full Self-Driving"</p>
              <p className="text-sm text-muted-foreground">
                Tech • 6 min read
              </p>
            </div>
            <span className="text-sm text-muted-foreground">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
