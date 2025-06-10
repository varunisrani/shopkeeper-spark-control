export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accommodation_images: {
        Row: {
          accommodation_id: string | null
          alt_text: string
          created_at: string | null
          id: string
          image_url: string
          pg_name: string
          sort_order: number
        }
        Insert: {
          accommodation_id?: string | null
          alt_text: string
          created_at?: string | null
          id?: string
          image_url: string
          pg_name: string
          sort_order?: number
        }
        Update: {
          accommodation_id?: string | null
          alt_text?: string
          created_at?: string | null
          id?: string
          image_url?: string
          pg_name?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "accommodation_images_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "accommodations"
            referencedColumns: ["id"]
          },
        ]
      }
      accommodations: {
        Row: {
          address: string
          code: string
          contact: string
          created_at: string | null
          description: string
          email: string
          features: string[]
          id: string
          main_image: string
          maps_link: string | null
          name: string
          pg_category: string
          updated_at: string | null
        }
        Insert: {
          address: string
          code: string
          contact: string
          created_at?: string | null
          description: string
          email: string
          features?: string[]
          id?: string
          main_image: string
          maps_link?: string | null
          name: string
          pg_category: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          code?: string
          contact?: string
          created_at?: string | null
          description?: string
          email?: string
          features?: string[]
          id?: string
          main_image?: string
          maps_link?: string | null
          name?: string
          pg_category?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      agent_embeddings: {
        Row: {
          agents_code: string | null
          created_at: string | null
          embedding: string | null
          folder_name: string
          id: number
          init_code: string | null
          main_code: string | null
          mcp_json: string | null
          metadata: Json | null
          models_code: string | null
          purpose: string | null
          tools_code: string | null
        }
        Insert: {
          agents_code?: string | null
          created_at?: string | null
          embedding?: string | null
          folder_name: string
          id?: number
          init_code?: string | null
          main_code?: string | null
          mcp_json?: string | null
          metadata?: Json | null
          models_code?: string | null
          purpose?: string | null
          tools_code?: string | null
        }
        Update: {
          agents_code?: string | null
          created_at?: string | null
          embedding?: string | null
          folder_name?: string
          id?: number
          init_code?: string | null
          main_code?: string | null
          mcp_json?: string | null
          metadata?: Json | null
          models_code?: string | null
          purpose?: string | null
          tools_code?: string | null
        }
        Relationships: []
      }
      agent_patterns: {
        Row: {
          agent_code: string
          agent_name: string
          agent_type: string
          complexity_level: number | null
          created_at: string | null
          embeddings: string | null
          id: string
          init_code: string
          metadata: Json | null
          purpose: string
          required_dependencies: string[] | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          agent_code: string
          agent_name: string
          agent_type: string
          complexity_level?: number | null
          created_at?: string | null
          embeddings?: string | null
          id?: string
          init_code: string
          metadata?: Json | null
          purpose: string
          required_dependencies?: string[] | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          agent_code?: string
          agent_name?: string
          agent_type?: string
          complexity_level?: number | null
          created_at?: string | null
          embeddings?: string | null
          id?: string
          init_code?: string
          metadata?: Json | null
          purpose?: string
          required_dependencies?: string[] | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      agent_templates: {
        Row: {
          agents_code: string | null
          created_at: string
          crew_code: string | null
          embedding: string | null
          folder_name: string
          id: number
          metadata: Json | null
          purpose: string | null
          tasks_code: string | null
          tools_code: string | null
        }
        Insert: {
          agents_code?: string | null
          created_at?: string
          crew_code?: string | null
          embedding?: string | null
          folder_name: string
          id?: never
          metadata?: Json | null
          purpose?: string | null
          tasks_code?: string | null
          tools_code?: string | null
        }
        Update: {
          agents_code?: string | null
          created_at?: string
          crew_code?: string | null
          embedding?: string | null
          folder_name?: string
          id?: never
          metadata?: Json | null
          purpose?: string | null
          tasks_code?: string | null
          tools_code?: string | null
        }
        Relationships: []
      }
      bills: {
        Row: {
          amount: number
          bill_date: string
          created_at: string
          details: string | null
          due_date: string
          id: string
          invoice_id: string
          resident_id: string
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          bill_date?: string
          created_at?: string
          details?: string | null
          due_date: string
          id?: string
          invoice_id: string
          resident_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          bill_date?: string
          created_at?: string
          details?: string | null
          due_date?: string
          id?: string
          invoice_id?: string
          resident_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bills_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "residents"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          created_at: string
          id: string
          messages: Json
          svg_code: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages: Json
          svg_code?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json
          svg_code?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crew_site_pages: {
        Row: {
          chunk_number: number
          content: string
          created_at: string
          embedding: string | null
          id: number
          metadata: Json
          summary: string
          title: string
          url: string
        }
        Insert: {
          chunk_number: number
          content: string
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json
          summary: string
          title: string
          url: string
        }
        Update: {
          chunk_number?: number
          content?: string
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json
          summary?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      custom_templates: {
        Row: {
          categories: string[] | null
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          difficulty_level: number | null
          embeddings: string | null
          extra_data: Json | null
          setup_code: string | null
          template_code: string
          template_id: number
          template_name: string
          template_type: string
          updated_at: string | null
        }
        Insert: {
          categories?: string[] | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          difficulty_level?: number | null
          embeddings?: string | null
          extra_data?: Json | null
          setup_code?: string | null
          template_code: string
          template_id?: number
          template_name: string
          template_type: string
          updated_at?: string | null
        }
        Update: {
          categories?: string[] | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          difficulty_level?: number | null
          embeddings?: string | null
          extra_data?: Json | null
          setup_code?: string | null
          template_code?: string
          template_id?: number
          template_name?: string
          template_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          address_field: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          address_field?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          address_field?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      electricity_readings: {
        Row: {
          amount: number
          created_at: string
          current_reading: number
          id: string
          previous_reading: number
          rate: number
          reading_date: string
          room_id: string
          status: string
          units: number
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          current_reading: number
          id?: string
          previous_reading: number
          rate: number
          reading_date?: string
          room_id: string
          status?: string
          units: number
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          current_reading?: number
          id?: string
          previous_reading?: number
          rate?: number
          reading_date?: string
          room_id?: string
          status?: string
          units?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "electricity_readings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      enquiries: {
        Row: {
          Area: string | null
          "Assigned By": string | null
          "Assigned To": string | null
          Budget: string | null
          "Client Name": string | null
          Configuration: string | null
          "Created Date": string | null
          created_at: string | null
          Email: string | null
          "Enquiry For": string | null
          "Enquiry Progress": string | null
          "Enquiry Source": string | null
          Favourite: string | null
          "First Phone Call Date": string | null
          "First Sales Comments": string | null
          "First Site Visit Date": string | null
          id: number
          "Last Remarks": string | null
          Mobile: string | null
          "Near to Win": string | null
          NFD: string | null
          "Property Type": string | null
          Remarks: string | null
          "Site Visit Scheduled Date": string | null
          updated_at: string | null
        }
        Insert: {
          Area?: string | null
          "Assigned By"?: string | null
          "Assigned To"?: string | null
          Budget?: string | null
          "Client Name"?: string | null
          Configuration?: string | null
          "Created Date"?: string | null
          created_at?: string | null
          Email?: string | null
          "Enquiry For"?: string | null
          "Enquiry Progress"?: string | null
          "Enquiry Source"?: string | null
          Favourite?: string | null
          "First Phone Call Date"?: string | null
          "First Sales Comments"?: string | null
          "First Site Visit Date"?: string | null
          id?: number
          "Last Remarks"?: string | null
          Mobile?: string | null
          "Near to Win"?: string | null
          NFD?: string | null
          "Property Type"?: string | null
          Remarks?: string | null
          "Site Visit Scheduled Date"?: string | null
          updated_at?: string | null
        }
        Update: {
          Area?: string | null
          "Assigned By"?: string | null
          "Assigned To"?: string | null
          Budget?: string | null
          "Client Name"?: string | null
          Configuration?: string | null
          "Created Date"?: string | null
          created_at?: string | null
          Email?: string | null
          "Enquiry For"?: string | null
          "Enquiry Progress"?: string | null
          "Enquiry Source"?: string | null
          Favourite?: string | null
          "First Phone Call Date"?: string | null
          "First Sales Comments"?: string | null
          "First Site Visit Date"?: string | null
          id?: number
          "Last Remarks"?: string | null
          Mobile?: string | null
          "Near to Win"?: string | null
          NFD?: string | null
          "Property Type"?: string | null
          Remarks?: string | null
          "Site Visit Scheduled Date"?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      hall_enquiries: {
        Row: {
          advance_amount: number | null
          Area: string | null
          "Assigned By": string | null
          "Assigned To": string | null
          Budget: string | null
          cancellation_reason: string | null
          catering_required: boolean | null
          "Client Name": string
          Configuration: string | null
          "Created Date": string
          created_at: string | null
          created_by: string | null
          decoration_required: boolean | null
          Email: string | null
          "Enquiry For": string | null
          "Enquiry Progress": string | null
          "Enquiry Source": string | null
          event_date: string | null
          expected_guests: number | null
          Favourite: string | null
          "First Phone Call Date": string | null
          "First Sales Comments": string | null
          "First Site Visit Date": string | null
          followup_count: number | null
          id: string
          "Last Remarks": string | null
          last_followup_date: string | null
          Mobile: string
          "Near to Win": string | null
          NFD: string | null
          parking_required: boolean | null
          payment_status: string | null
          priority: string | null
          "Property Type": string | null
          Remarks: string | null
          requirements: string | null
          "Site Visit Scheduled Date": string | null
          source: string | null
          time_slot: string | null
          total_amount: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          advance_amount?: number | null
          Area?: string | null
          "Assigned By"?: string | null
          "Assigned To"?: string | null
          Budget?: string | null
          cancellation_reason?: string | null
          catering_required?: boolean | null
          "Client Name": string
          Configuration?: string | null
          "Created Date": string
          created_at?: string | null
          created_by?: string | null
          decoration_required?: boolean | null
          Email?: string | null
          "Enquiry For"?: string | null
          "Enquiry Progress"?: string | null
          "Enquiry Source"?: string | null
          event_date?: string | null
          expected_guests?: number | null
          Favourite?: string | null
          "First Phone Call Date"?: string | null
          "First Sales Comments"?: string | null
          "First Site Visit Date"?: string | null
          followup_count?: number | null
          id: string
          "Last Remarks"?: string | null
          last_followup_date?: string | null
          Mobile: string
          "Near to Win"?: string | null
          NFD?: string | null
          parking_required?: boolean | null
          payment_status?: string | null
          priority?: string | null
          "Property Type"?: string | null
          Remarks?: string | null
          requirements?: string | null
          "Site Visit Scheduled Date"?: string | null
          source?: string | null
          time_slot?: string | null
          total_amount?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          advance_amount?: number | null
          Area?: string | null
          "Assigned By"?: string | null
          "Assigned To"?: string | null
          Budget?: string | null
          cancellation_reason?: string | null
          catering_required?: boolean | null
          "Client Name"?: string
          Configuration?: string | null
          "Created Date"?: string
          created_at?: string | null
          created_by?: string | null
          decoration_required?: boolean | null
          Email?: string | null
          "Enquiry For"?: string | null
          "Enquiry Progress"?: string | null
          "Enquiry Source"?: string | null
          event_date?: string | null
          expected_guests?: number | null
          Favourite?: string | null
          "First Phone Call Date"?: string | null
          "First Sales Comments"?: string | null
          "First Site Visit Date"?: string | null
          followup_count?: number | null
          id?: string
          "Last Remarks"?: string | null
          last_followup_date?: string | null
          Mobile?: string
          "Near to Win"?: string | null
          NFD?: string | null
          parking_required?: boolean | null
          payment_status?: string | null
          priority?: string | null
          "Property Type"?: string | null
          Remarks?: string | null
          requirements?: string | null
          "Site Visit Scheduled Date"?: string | null
          source?: string | null
          time_slot?: string | null
          total_amount?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      Inquiry_Progress: {
        Row: {
          created_at: string
          date: string | null
          eid: number | null
          id: number
          progress_type: string | null
          remark: string | null
        }
        Insert: {
          created_at?: string
          date?: string | null
          eid?: number | null
          id?: number
          progress_type?: string | null
          remark?: string | null
        }
        Update: {
          created_at?: string
          date?: string | null
          eid?: number | null
          id?: number
          progress_type?: string | null
          remark?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Inquiry_Progress_eid_fkey"
            columns: ["eid"]
            isOneToOne: false
            referencedRelation: "enquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          additional_notes: string | null
          additional_sale_notes: string | null
          battery_health: number | null
          brand: string
          color: string | null
          condition: string
          created_at: string
          customer_address: string | null
          customer_name: string | null
          customer_phone: string | null
          exchange_old_phone: boolean | null
          id: string
          imei: string
          inward_by: string | null
          model: string
          payment_method: string | null
          purchase_date: string
          purchase_price: number
          quantity: number | null
          sale_date: string | null
          sale_price: number
          sold_date: string | null
          status: string
          supplier_id: string | null
          updated_at: string
          variant: string | null
          venue: string | null
          warranty_months: number | null
        }
        Insert: {
          additional_notes?: string | null
          additional_sale_notes?: string | null
          battery_health?: number | null
          brand: string
          color?: string | null
          condition?: string
          created_at?: string
          customer_address?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          exchange_old_phone?: boolean | null
          id?: string
          imei: string
          inward_by?: string | null
          model: string
          payment_method?: string | null
          purchase_date: string
          purchase_price: number
          quantity?: number | null
          sale_date?: string | null
          sale_price: number
          sold_date?: string | null
          status?: string
          supplier_id?: string | null
          updated_at?: string
          variant?: string | null
          venue?: string | null
          warranty_months?: number | null
        }
        Update: {
          additional_notes?: string | null
          additional_sale_notes?: string | null
          battery_health?: number | null
          brand?: string
          color?: string | null
          condition?: string
          created_at?: string
          customer_address?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          exchange_old_phone?: boolean | null
          id?: string
          imei?: string
          inward_by?: string | null
          model?: string
          payment_method?: string | null
          purchase_date?: string
          purchase_price?: number
          quantity?: number | null
          sale_date?: string | null
          sale_price?: number
          sold_date?: string | null
          status?: string
          supplier_id?: string | null
          updated_at?: string
          variant?: string | null
          venue?: string | null
          warranty_months?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          customer_id: string | null
          discount: number | null
          due_date: string | null
          id: string
          invoice_date: string
          invoice_id: string
          sale_id: string | null
          status: string
          subtotal: number
          tax_amount: number | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          discount?: number | null
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_id: string
          sale_id?: string | null
          status?: string
          subtotal: number
          tax_amount?: number | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          discount?: number | null
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_id?: string
          sale_id?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      login: {
        Row: {
          created_at: string
          id: string
          password: string
          role: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password: string
          role: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          password?: string
          role?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      mcp_templates: {
        Row: {
          agents_code: string
          created_at: string | null
          crew_code: string
          embedding: string | null
          folder_name: string
          id: string
          main_code: string | null
          metadata: Json
          purpose: string
          readme_content: string | null
          run_agent: string | null
          tasks_code: string
          tools_code: string
          updated_at: string | null
        }
        Insert: {
          agents_code: string
          created_at?: string | null
          crew_code: string
          embedding?: string | null
          folder_name: string
          id?: string
          main_code?: string | null
          metadata?: Json
          purpose: string
          readme_content?: string | null
          run_agent?: string | null
          tasks_code: string
          tools_code: string
          updated_at?: string | null
        }
        Update: {
          agents_code?: string
          created_at?: string | null
          crew_code?: string
          embedding?: string | null
          folder_name?: string
          id?: string
          main_code?: string | null
          metadata?: Json
          purpose?: string
          readme_content?: string | null
          run_agent?: string | null
          tasks_code?: string
          tools_code?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      mcp_tools: {
        Row: {
          config: Json | null
          connection_script: string | null
          created_at: string | null
          embedding: string | null
          example_crew_code: string | null
          folder_name: string
          id: string
          metadata: Json
          purpose: string
          readme_content: string | null
          requirements: string | null
          tool_code: string | null
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          connection_script?: string | null
          created_at?: string | null
          embedding?: string | null
          example_crew_code?: string | null
          folder_name: string
          id?: string
          metadata?: Json
          purpose: string
          readme_content?: string | null
          requirements?: string | null
          tool_code?: string | null
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          connection_script?: string | null
          created_at?: string | null
          embedding?: string | null
          example_crew_code?: string | null
          folder_name?: string
          id?: string
          metadata?: Json
          purpose?: string
          readme_content?: string | null
          requirements?: string | null
          tool_code?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      new_table_name: {
        Row: {
          chunk_number: number
          content: string
          created_at: string
          embedding: string | null
          id: number
          metadata: Json
          summary: string
          title: string
          url: string
        }
        Insert: {
          chunk_number: number
          content: string
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json
          summary: string
          title: string
          url: string
        }
        Update: {
          chunk_number?: number
          content?: string
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json
          summary?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      residents: {
        Row: {
          created_at: string
          date_of_birth: string | null
          email: string | null
          gender: string | null
          id: string
          join_date: string
          monthly_rent: number | null
          name: string
          pg_location: string | null
          phone: string
          room_id: string | null
          security_deposit: number | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          join_date?: string
          monthly_rent?: number | null
          name: string
          pg_location?: string | null
          phone: string
          room_id?: string | null
          security_deposit?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          join_date?: string
          monthly_rent?: number | null
          name?: string
          pg_location?: string | null
          phone?: string
          room_id?: string | null
          security_deposit?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "residents_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_types: {
        Row: {
          accommodation_id: string | null
          availability: string
          created_at: string | null
          id: string
          price: number
          type: string
          updated_at: string | null
        }
        Insert: {
          accommodation_id?: string | null
          availability: string
          created_at?: string | null
          id?: string
          price: number
          type: string
          updated_at?: string | null
        }
        Update: {
          accommodation_id?: string | null
          availability?: string
          created_at?: string | null
          id?: string
          price?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_types_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "accommodations"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          capacity: number
          created_at: string
          floor: string
          id: string
          occupancy: number
          rent: number
          room_no: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          capacity: number
          created_at?: string
          floor: string
          id?: string
          occupancy?: number
          rent: number
          room_no: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          floor?: string
          id?: string
          occupancy?: number
          rent?: number
          room_no?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          additional_sale_notes: string | null
          created_at: string
          customer_address: string | null
          customer_id: string | null
          discount: number | null
          exchange_old_phone: boolean | null
          final_amount: number
          id: string
          imei_serial: string | null
          inventory_id: string | null
          payment_method: string
          sale_date: string
          sale_id: string
          sale_price: number
          status: string
          updated_at: string
        }
        Insert: {
          additional_sale_notes?: string | null
          created_at?: string
          customer_address?: string | null
          customer_id?: string | null
          discount?: number | null
          exchange_old_phone?: boolean | null
          final_amount: number
          id?: string
          imei_serial?: string | null
          inventory_id?: string | null
          payment_method: string
          sale_date?: string
          sale_id: string
          sale_price: number
          status?: string
          updated_at?: string
        }
        Update: {
          additional_sale_notes?: string | null
          created_at?: string
          customer_address?: string | null
          customer_id?: string | null
          discount?: number | null
          exchange_old_phone?: boolean | null
          final_amount?: number
          id?: string
          imei_serial?: string | null
          inventory_id?: string | null
          payment_method?: string
          sale_date?: string
          sale_id?: string
          sale_price?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      site_pages: {
        Row: {
          chunk_number: number
          content: string
          created_at: string
          embedding: string | null
          id: number
          metadata: Json
          summary: string
          title: string
          url: string
        }
        Insert: {
          chunk_number: number
          content: string
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json
          summary: string
          title: string
          url: string
        }
        Update: {
          chunk_number?: number
          content?: string
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json
          summary?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      svg_storage: {
        Row: {
          content: string
          created_at: string | null
          data_url: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          data_url?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          data_url?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          customer_id: string | null
          id: string
          inventory_id: string | null
          quantity: number
          supplier_id: string | null
          transaction_date: string
          transaction_id: string
          type: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id?: string | null
          id?: string
          inventory_id?: string | null
          quantity?: number
          supplier_id?: string | null
          transaction_date?: string
          transaction_id: string
          type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string | null
          id?: string
          inventory_id?: string | null
          quantity?: number
          supplier_id?: string | null
          transaction_date?: string
          transaction_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          id: number
          password: string | null
          username: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          password?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          password?: string | null
          username?: string | null
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_agent_patterns: {
        Args: {
          query_embedding: string
          match_count?: number
          filter_object?: Json
        }
        Returns: {
          uuid: string
          agent_name: string
          agent_type: string
          purpose: string
          agent_code: string
          tools_code: string
          metadata: Json
          tags: string[]
          complexity_level: number
          similarity: number
        }[]
      }
      match_agent_templates: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: number
          folder_name: string
          agents_code: string
          tools_code: string
          tasks_code: string
          crew_code: string
          purpose: string
          metadata: Json
          similarity: number
        }[]
      }
      match_custom_templates: {
        Args: {
          query_embedding: string
          match_count?: number
          filter_object?: Json
        }
        Returns: {
          template_id: number
          template_name: string
          template_type: string
          description: string
          template_code: string
          setup_code: string
          extra_data: Json
          categories: string[]
          difficulty_level: number
          dependencies: string[]
          similarity: number
        }[]
      }
      match_mcp_templates: {
        Args: {
          query_embedding: string
          match_threshold?: number
          match_count?: number
        }
        Returns: {
          id: string
          folder_name: string
          purpose: string
          metadata: Json
          similarity: number
        }[]
      }
      match_mcp_tools: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: string
          folder_name: string
          purpose: string
          tool_code: string
          example_crew_code: string
          readme_content: string
          connection_script: string
          requirements: string
          config: Json
          metadata: Json
          embedding: string
          similarity: number
        }[]
      }
      match_site_pages: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          url: string
          chunk_number: number
          title: string
          summary: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      new_function_name: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          url: string
          chunk_number: number
          title: string
          summary: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      search_agent_embeddings: {
        Args: {
          query_embedding: string
          similarity_threshold?: number
          match_count?: number
        }
        Returns: {
          id: number
          folder_name: string
          purpose: string
          metadata: Json
          similarity: number
        }[]
      }
      search_agents_by_text: {
        Args: { search_query: string }
        Returns: {
          id: string
          agent_type: string
          agent_name: string
          purpose: string
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
