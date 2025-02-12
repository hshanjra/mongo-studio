import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { FileBoxIcon, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import ModelSearchInput from "./model-search-input";
import { Button } from "./ui/button";
import { ModeToggle } from "./theme-toggle";
import { useDeleteModel, useModels } from "@/hooks/api/models";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Prompt from "./ui/prompt";

// const menuItems = [
//   { text: "Models", icon: PanelBottom, path: "/models" },
//   { text: "Model Builder", icon: PanelBottom, path: "/models/builder" },
//   { text: "Collections", icon: PanelBottom, path: "/collections" },
// ];

export function AppSidebar() {
  // Fetch all models
  const { data: models = [], isLoading } = useModels();

  // Fetch all collections

  const { mutate: deleteModel } = useDeleteModel();

  const handleRemoveModel = (modelName: string) => {
    // Add a prompt to confirm
    deleteModel({ modelName });
  };

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <ModelSearchInput />
        </SidebarGroup>
        <SidebarGroup>
          <Button size={"sm"} asChild>
            <Link to={"/create"}>
              <FileBoxIcon />
              Create Model
            </Link>
          </Button>
          <SidebarGroupLabel className="font-bold mt-2">
            All Models
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading ? (
                <SidebarMenuSkeleton />
              ) : models.length > 0 ? (
                models.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <Link to={`/models/${item.name}`}>
                        {/* {React.createElement(item.icon)} */}
                        <span className="font-semibold text-xs">
                          {item.name}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                          <MoreHorizontal />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem>
                          <Link
                            to={`/models/${item.name}/edit`}
                            className="flex items-center gap-2 text-xs"
                          >
                            <Pencil size={14} /> <span>Edit Model</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Prompt
                            title="Delete Item"
                            description="Are you sure you want to delete this item?"
                            onConfirm={() => {
                              // handle confirmation
                              return handleRemoveModel(item.name);
                            }}
                          >
                            <button
                              className="flex items-center gap-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <Trash size={14} className="text-red-500" />
                              <span>Delete Model</span>
                            </button>
                          </Prompt>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))
              ) : (
                <p className="text-xs text-muted-foreground p-2">
                  No models found.
                </p>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="font-bold mt-2">
            All Collections
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <p className="text-xs text-muted-foreground p-2">
                No collections found.
              </p>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 mx-auto">
          <span className="text-xs">Theme</span>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
