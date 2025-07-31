// src/types/activity.ts
export interface NewActivityPageProps {
  isModal?: boolean;
  onSuccess?: () => void;
  onDirtyChange?: (dirty: boolean) => void;
}
