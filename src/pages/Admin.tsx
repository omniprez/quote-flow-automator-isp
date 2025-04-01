
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import ServiceManager from "@/components/admin/ServiceManager";
import BandwidthManager from "@/components/admin/BandwidthManager";
import FeaturesManager from "@/components/admin/FeaturesManager";
import AdminHeader from "@/components/admin/AdminHeader";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("services");

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <AdminHeader />
      
      <Tabs defaultValue="services" className="mt-6" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="bandwidths">Bandwidth Options</TabsTrigger>
          <TabsTrigger value="features">Additional Features</TabsTrigger>
        </TabsList>
        
        <TabsContent value="services" className="mt-6">
          <ServiceManager />
        </TabsContent>
        
        <TabsContent value="bandwidths" className="mt-6">
          <BandwidthManager />
        </TabsContent>
        
        <TabsContent value="features" className="mt-6">
          <FeaturesManager />
        </TabsContent>
      </Tabs>
      
      <Toaster />
    </div>
  );
};

export default Admin;
