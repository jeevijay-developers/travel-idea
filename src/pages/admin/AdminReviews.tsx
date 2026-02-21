import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Check, X, Trash2, Eye, EyeOff, ArrowUpDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TablePagination } from "@/components/admin/TablePagination";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PAGE_SIZE = 10;

export default function AdminReviews() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sortByStars, setSortByStars] = useState<"none" | "high" | "low">("none");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-reviews", page, filter, sortByStars],
    queryFn: async () => {
      let query = supabase
        .from("reviews")
        .select("*", { count: "exact" });

      if (sortByStars === "high") {
        query = query.order("rating", { ascending: false }).order("created_at", { ascending: false });
      } else if (sortByStars === "low") {
        query = query.order("rating", { ascending: true }).order("created_at", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      query = query.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

      if (filter === "pending") query = query.eq("is_approved", false);
      if (filter === "approved") query = query.eq("is_approved", true);

      const { data, error, count } = await query;
      if (error) throw error;
      return { reviews: data || [], total: count || 0 };
    },
  });

  const toggleApproval = useMutation({
    mutationFn: async ({ id, approve }: { id: string; approve: boolean }) => {
      const { error } = await supabase.from("reviews").update({ is_approved: approve }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { approve }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast({ title: approve ? "Review approved" : "Review hidden" });
    },
  });

  const deleteReview = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast({ title: "Review deleted" });
      setDeleteId(null);
    },
  });

  const reviews = data?.reviews || [];
  const totalPages = Math.ceil((data?.total || 0) / PAGE_SIZE);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reviews</h1>
          <p className="text-muted-foreground text-sm">Manage customer reviews and ratings</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {(["all", "pending", "approved"] as const).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              onClick={() => { setFilter(f); setPage(1); }}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
          <Select value={sortByStars} onValueChange={(v) => { setSortByStars(v as "none" | "high" | "low"); setPage(1); }}>
            <SelectTrigger className="w-[160px] h-9">
              <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
              <SelectValue placeholder="Sort by stars" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Latest first</SelectItem>
              <SelectItem value="high">Stars: High → Low</SelectItem>
              <SelectItem value="low">Stars: Low → High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="hidden md:table-cell">Review</TableHead>
              <TableHead className="hidden sm:table-cell">Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
              </TableRow>
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No reviews found</TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.email}</p>
                      {review.location && <p className="text-xs text-muted-foreground">{review.location}</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-travel-gold text-travel-gold" : "text-muted-foreground/20"}`} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-[250px]">
                    <p className="text-sm text-muted-foreground line-clamp-2">{review.review_text}</p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {review.destination && <Badge variant="secondary" className="text-xs">{review.destination}</Badge>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={review.is_approved ? "default" : "outline"} className="text-xs">
                      {review.is_approved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                    {format(new Date(review.created_at), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {review.is_approved ? (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          title="Hide from website"
                          onClick={() => toggleApproval.mutate({ id: review.id, approve: false })}
                        >
                          <EyeOff className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-primary"
                          title="Approve & show on website"
                          onClick={() => toggleApproval.mutate({ id: review.id, approve: true })}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        title="Delete"
                        onClick={() => setDeleteId(review.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination currentPage={page} totalItems={data?.total || 0} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && deleteReview.mutate(deleteId)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
