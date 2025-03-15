
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Languages, Award, Clock } from 'lucide-react';

const PIAProfile = () => {
  const { id } = useParams();

  const { data: pia, isLoading } = useQuery({
    queryKey: ['pia', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('professional_independent_aides')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!pia) {
    return <div className="p-8 text-center">Profile not found</div>;
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="grid gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h2 className="text-2xl font-bold">{pia.Name}</h2>
            <Badge className="mb-4">{pia.verification_status}</Badge>
            <p className="text-gray-600">{pia.Bio}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <span>{pia.Email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-500" />
                <span>{pia["Phone Number"]}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span>{pia["Locations Serviced"]?.join(", ")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Languages className="w-5 h-5 text-gray-500" />
                <span>{pia.Languages?.join(", ")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experience & Qualifications */}
        <Card>
          <CardHeader>
            <CardTitle>Experience & Qualifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-semibold">Experience</p>
                  <p>{pia.Experience} years</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-semibold">Available Shifts</p>
                  <p>{pia["Available Shifts"]?.join(", ")}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Services Provided</h3>
              <div className="flex flex-wrap gap-2">
                {pia["Services Provided"]?.map((service: string) => (
                  <Badge key={service} variant="secondary">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Certifications</h3>
              <div className="space-y-2">
                <p>License Type: {pia["License Type"]}</p>
                <p>HCA Registry ID: {pia["HCA Registry ID"]}</p>
                <p>HCA Expiration: {pia["HCA Expiration Date"]}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PIAProfile;
