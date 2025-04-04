
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EditableProfileProps, ProfileItem } from "../types";

export const BadgesView = ({ items }: { items: ProfileItem[] }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((item, index) => (
      <Badge key={index} variant="secondary">
        {String(item.value)}
      </Badge>
    ))}
  </div>
);

export const BadgesEdit = ({ items, onItemsChange }: EditableProfileProps) => (
  <div className="space-y-2">
    {items.map((item, index) => (
      <div key={index} className="flex items-center gap-2">
        <Input
          value={String(item.value)}
          onChange={(e) => {
            const newItems = [...items];
            newItems[index] = { ...item, value: e.target.value };
            onItemsChange(newItems);
          }}
          className="w-full"
        />
      </div>
    ))}
  </div>
);
