import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  destination: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    supabase.from("enquiries").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setEnquiries(data);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Enquiries</h1>
      <div className="bg-card border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No enquiries yet. Enquiries will appear here when users submit the contact form.
                </TableCell>
              </TableRow>
            ) : (
              enquiries.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.name || "-"}</TableCell>
                  <TableCell>{e.email || "-"}</TableCell>
                  <TableCell>{e.destination || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={e.status === "new" ? "default" : "secondary"}>
                      {e.status || "new"}
                    </Badge>
                  </TableCell>
                  <TableCell>{e.created_at ? new Date(e.created_at).toLocaleDateString() : "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}