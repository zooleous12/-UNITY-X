import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { 
  Plus, 
  BookOpen, 
  FileText, 
  Brain,
  Trash2,
  Edit,
  Home,
  LogOut,
  Sparkles
} from "lucide-react";

export default function Courses() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: "",
    code: "",
    color: "#6366f1",
    semester: "",
    instructor: "",
    description: "",
  });

  const { data: coursesData, refetch } = trpc.courses.list.useQuery();
  const createCourseMutation = trpc.courses.create.useMutation({
    onSuccess: (data) => {
      toast.success("Course created successfully!");
      refetch();
      setIsCreateDialogOpen(false);
      setNewCourse({
        name: "",
        code: "",
        color: "#6366f1",
        semester: "",
        instructor: "",
        description: "",
      });
    },
    onError: (error) => {
      toast.error(`Failed to create course: ${error.message}`);
    },
  });

  const deleteCourseMutation = trpc.courses.delete.useMutation({
    onSuccess: () => {
      toast.success("Course deleted successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete course: ${error.message}`);
    },
  });

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const handleCreateCourse = () => {
    if (!newCourse.name.trim()) {
      toast.error("Course name is required");
      return;
    }
    createCourseMutation.mutate(newCourse);
  };

  const handleDeleteCourse = (courseId: number) => {
    if (confirm("Are you sure you want to delete this course? Materials will not be deleted, just unlinked.")) {
      deleteCourseMutation.mutate({ courseId });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to access courses</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button>Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const courses = coursesData?.courses || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">Lecture Me</span>
                <span className="text-sm ml-2 text-gray-600">College Edition</span>
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="text-sm">
                <div className="font-medium">{user.name || "Student"}</div>
                <div className="text-muted-foreground text-xs">{user.email}</div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Courses</h1>
            <p className="text-muted-foreground text-lg">
              Organize your study materials by class
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
                <Plus className="w-5 h-5 mr-2" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
                <DialogDescription>
                  Add a course to organize your study materials
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Course Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Introduction to Biology"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Course Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g., BIO101"
                    value={newCourse.code}
                    onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    placeholder="e.g., Fall 2026"
                    value={newCourse.semester}
                    onChange={(e) => setNewCourse({ ...newCourse, semester: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    placeholder="e.g., Dr. Smith"
                    value={newCourse.instructor}
                    onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={newCourse.color}
                      onChange={(e) => setNewCourse({ ...newCourse, color: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      value={newCourse.color}
                      onChange={(e) => setNewCourse({ ...newCourse, color: e.target.value })}
                      placeholder="#6366f1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Course description or notes..."
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateCourse}
                  disabled={!newCourse.name || createCourseMutation.isPending}
                >
                  {createCourseMutation.isPending ? "Creating..." : "Create Course"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="card-premium hover:scale-105 transition-transform">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${course.color}20` }}
                    >
                      <BookOpen className="w-6 h-6" style={{ color: course.color }} />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-xl">{course.name}</CardTitle>
                  {course.code && (
                    <Badge variant="secondary" className="w-fit">
                      {course.code}
                    </Badge>
                  )}
                  <CardDescription>
                    {course.semester && <div>{course.semester}</div>}
                    {course.instructor && <div>{course.instructor}</div>}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {course.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {course.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{course.materialsCount} materials</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Brain className="w-4 h-4" />
                      <span>{course.flashcardsCount} cards</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first course to start organizing your study materials
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
