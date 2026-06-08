import { useEffect } from "react";
import { useForm, Control, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateRecord,
  useUpdateRecord,
  getListRecordsQueryKey,
  getGetRecordStatsQueryKey
} from "@workspace/api-client-react";
import type { Record } from "@workspace/api-client-react";
import { recordSchema, RecordFormValues, defaultRecordValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// ✅ No "Other" in Skin, Visual, Physical, Accessory — matches PDF exactly
const SKIN_OPTIONS = ["Normal", "Redness", "Swelling", "Discomfort"];
const VISUAL_OPTIONS = ["Housing intact", "Cover damage", "Corrosion", "Moisture related issues"];
const AUDIO_OPTIONS = ["No sound/output", "Weak Sound", "Sound too Loud", "Distorted/Muffled Sound", "Intermittent Sound Cutting", "Feedback/Whistling"];
const PHYSICAL_OPTIONS = ["Processor Won't power on", "Battery draining too quickly", "Battery Compartment Issues", "Cover damage", "Processor falls off frequently", "Skin irritation at implant site"];
const ACCESSORY_OPTIONS = ["Attachment Clip malfunction", "WaterWear Problems", "Program switching failure", "Volume control Unresponsive"];
// ✅ "Other" only in Connectivity and Steps — matches PDF
const CONNECTIVITY_OPTIONS = ["SAMBA 2 GO pairing failure", "Streaming audio problems", "SAMBA 2 remote app malfunction", "Other"];
const STEPS_OPTIONS = ["Replaced battery", "Cleaned device components", "Battery contacts cleaned", "Magnet strength verified", "SAMBA 2 GO re-paired", "Remote App reinstalled", "Other"];

const RESOLVED_HOW_OPTIONS = [
  "With guidance",
  "Cover/Magnet replaced",
  "Required service center repair",
  "Referred to Audiologist/Changed fitting parameters",
  "Other",
];

// ✅ Stores "Other: <text>" inside the array itself — no separate field needed
function CheckboxGroup({
  control,
  name,
  label,
  options,
}: {
  control: Control<RecordFormValues>;
  name: keyof RecordFormValues;
  label: string;
  options: string[];
}) {
  const values = useWatch({ control, name }) as string[] || [];
  const hasOtherOption = options.includes("Other");
  const otherEntry = values.find((v) => v === "Other" || v.startsWith("Other: "));
  const otherText = otherEntry?.startsWith("Other: ") ? otherEntry.slice(7) : "";
  const showOther = hasOtherOption && !!otherEntry;

  return (
    <FormField
      control={control}
      name={name as any}
      render={() => (
        <FormItem>
          <div className="mb-2">
            <FormLabel className="text-base">{label}</FormLabel>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {options.map((item) => (
              <FormField
                key={item}
                control={control}
                name={name as any}
                render={({ field }) => {
                  const fieldValues = (field.value as string[]) || [];
                  const isChecked = item === "Other"
                    ? fieldValues.some((v) => v === "Other" || v.startsWith("Other: "))
                    : fieldValues.includes(item);

                  return (
                    <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            if (item === "Other") {
                              if (checked) {
                                field.onChange([
                                  ...fieldValues.filter((v) => v !== "Other" && !v.startsWith("Other: ")),
                                  "Other",
                                ]);
                              } else {
                                field.onChange(
                                  fieldValues.filter((v) => v !== "Other" && !v.startsWith("Other: "))
                                );
                              }
                            } else {
                              checked
                                ? field.onChange([...fieldValues, item])
                                : field.onChange(fieldValues.filter((v) => v !== item));
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">{item}</FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>

          {showOther && (
            <FormField
              control={control}
              name={name as any}
              render={({ field }) => {
                const fieldValues = (field.value as string[]) || [];
                return (
                  <FormItem className="mt-2">
                    <FormLabel className="text-sm">Please specify:</FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-16"
                        placeholder="Enter details..."
                        value={otherText}
                        onChange={(e) => {
                          const text = e.target.value;
                          const withoutOther = fieldValues.filter(
                            (v) => v !== "Other" && !v.startsWith("Other: ")
                          );
                          field.onChange([...withoutOther, text ? `Other: ${text}` : "Other"]);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function ResolvedHowCheckboxes({ control }: { control: Control<RecordFormValues> }) {
  const resolvedHowValue = useWatch({ control, name: "resolvedHow" }) as string || "";
  const selected = resolvedHowValue ? resolvedHowValue.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const otherEntry = selected.find((v) => v === "Other" || v.startsWith("Other: "));
  const otherText = otherEntry?.startsWith("Other: ") ? otherEntry.slice(7) : "";
  const showOther = !!otherEntry;

  const toggle = (item: string, onChange: (val: string) => void, currentSelected: string[]) => {
    if (item === "Other") {
      const hasOther = currentSelected.some((v) => v === "Other" || v.startsWith("Other: "));
      const withoutOther = currentSelected.filter((v) => v !== "Other" && !v.startsWith("Other: "));
      onChange(hasOther ? withoutOther.join(", ") : [...withoutOther, "Other"].join(", "));
    } else {
      const updated = currentSelected.includes(item)
        ? currentSelected.filter((v) => v !== item)
        : [...currentSelected, item];
      onChange(updated.join(", "));
    }
  };

  return (
    <FormField
      control={control}
      name="resolvedHow"
      render={({ field }) => {
        const currentSelected = field.value
          ? (field.value as string).split(",").map((s) => s.trim()).filter(Boolean)
          : [];

        return (
          <FormItem>
            <FormLabel className="text-base">If YES — how was it resolved?</FormLabel>
            <div className="grid grid-cols-1 gap-y-2 mt-2">
              {RESOLVED_HOW_OPTIONS.map((item) => {
                const isChecked = item === "Other"
                  ? currentSelected.some((v) => v === "Other" || v.startsWith("Other: "))
                  : currentSelected.includes(item);

                return (
                  <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggle(item, field.onChange, currentSelected)}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">{item}</FormLabel>
                  </FormItem>
                );
              })}
            </div>
            {showOther && (
              <FormItem className="mt-2">
                <FormLabel className="text-sm">Please specify:</FormLabel>
                <FormControl>
                  <Textarea
                    className="h-16"
                    placeholder="Enter details..."
                    value={otherText}
                    onChange={(e) => {
                      const text = e.target.value;
                      const withoutOther = currentSelected.filter(
                        (v) => v !== "Other" && !v.startsWith("Other: ")
                      );
                      field.onChange(
                        [...withoutOther, text ? `Other: ${text}` : "Other"].join(", ")
                      );
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export function TrackerForm({
  editingRecord,
  onCancelEdit,
  onSuccess
}: {
  editingRecord: Record | null;
  onCancelEdit: () => void;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<RecordFormValues>({
    resolver: zodResolver(recordSchema),
    defaultValues: defaultRecordValues,
  });

  useEffect(() => {
    if (editingRecord) {
      form.reset({
        patientName: editingRecord.patientName || "",
        dob: editingRecord.dob || "",
        phone: editingRecord.phone || "",
        serial: editingRecord.serial || "",
        implant: editingRecord.implant || "",
        issueDescription: editingRecord.issueDescription || "",
        conditions: editingRecord.conditions || "",
        problemFirstOccurred: (editingRecord as any).problemFirstOccurred || "",
        occurrenceFrequency: (editingRecord as any).occurrenceFrequency || "",
        specificConditions: (editingRecord as any).specificConditions || "",
        skin: editingRecord.skin || [],
        visual: editingRecord.visual || [],
        audio: editingRecord.audio || [],
        physical: editingRecord.physical || [],
        accessory: editingRecord.accessory || [],
        connectivity: editingRecord.connectivity || [],
        steps: editingRecord.steps || [],
        skinOther: "",
        visualOther: "",
        audioOther: "",
        physicalOther: "",
        accessoryOther: "",
        connectivityOther: "",
        stepsOther: "",
        adhearAudioOther: "",
        adhearPhysicalOther: "",
        adhearAccessoryOther: "",
        adhearStepsOther: "",
        resolved: editingRecord.resolved || "",
        resolvedHow: editingRecord.resolvedHow || "",
        nextAction: editingRecord.nextAction || "",
        contactName: editingRecord.contactName || "",
        contactEmail: editingRecord.contactEmail || "",
      });
    } else {
      form.reset(defaultRecordValues);
    }
  }, [editingRecord, form]);

  const createRecord = useCreateRecord({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListRecordsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetRecordStatsQueryKey() });
        toast({ title: "Record created successfully" });
        form.reset(defaultRecordValues);
        onSuccess();
      },
      onError: () => {
        toast({ title: "Failed to create record", variant: "destructive" });
      }
    }
  });

  const updateRecord = useUpdateRecord({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListRecordsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetRecordStatsQueryKey() });
        toast({ title: "Record updated successfully" });
        form.reset(defaultRecordValues);
        onSuccess();
      },
      onError: () => {
        toast({ title: "Failed to update record", variant: "destructive" });
      }
    }
  });

  const onSubmit = (data: RecordFormValues) => {
    if (editingRecord) {
      updateRecord.mutate({ id: editingRecord.id, data });
    } else {
      createRecord.mutate({ data });
    }
  };

  const isPending = createRecord.isPending || updateRecord.isPending;

  return (
    <Card className="border-primary/20 shadow-md">
      <CardHeader className="bg-primary/5 border-b border-primary/10 flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-primary flex items-center gap-2">
          {editingRecord ? (
            <>Editing Record <Badge variant="secondary" className="ml-2">#{editingRecord.id}</Badge></>
          ) : (
            "New Patient Record"
          )}
        </CardTitle>
        {editingRecord && (
          <Button variant="ghost" size="sm" onClick={onCancelEdit}>Cancel Edit</Button>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* Patient & Device Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Patient & Device Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField control={form.control} name="patientName" render={({ field }) => (
                  <FormItem><FormLabel>Patient Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="dob" render={({ field }) => (
                  <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="serial" render={({ field }) => (
                  <FormItem><FormLabel>Device Serial Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="implant" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Implant Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Bonebridge (BCI 601)">Bonebridge (BCI 601)</SelectItem>
                        <SelectItem value="Bonebridge (BCI 602)">Bonebridge (BCI 602)</SelectItem>
                        <SelectItem value="Soundbridge (VORP 503)">Soundbridge (VORP 503)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Issue Description & Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Device Issue Description</h3>
              <FormField control={form.control} name="issueDescription" render={({ field }) => (
                <FormItem>
                  <FormLabel>Please describe the problem you're experiencing with the SAMBA 2 device</FormLabel>
                  <FormControl><Textarea className="h-24" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <h3 className="text-lg font-medium border-b pb-2 mt-6">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="problemFirstOccurred" render={({ field }) => (
                  <FormItem><FormLabel>When did the problem first occur?</FormLabel><FormControl><Input placeholder="e.g. 2 weeks ago" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="occurrenceFrequency" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Constant or Intermittent?</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Constant">Constant</SelectItem>
                        <SelectItem value="Intermittent">Intermittent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="specificConditions" render={({ field }) => (
                  <FormItem><FormLabel>Any specific conditions when problem occurs?</FormLabel><FormControl><Input placeholder="e.g. outdoors, during calls" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              {/* Skin & Visual — no Other */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <CheckboxGroup control={form.control} name="skin" label="Skin condition at site" options={SKIN_OPTIONS} />
                <CheckboxGroup control={form.control} name="visual" label="Visual inspection" options={VISUAL_OPTIONS} />
              </div>
            </div>

            {/* Common Issues Checklist */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Common Issues Checklist</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                <CheckboxGroup control={form.control} name="audio" label="Audio Quality Issues" options={AUDIO_OPTIONS} />
                <CheckboxGroup control={form.control} name="physical" label="Physical Device Issues" options={PHYSICAL_OPTIONS} />
                <CheckboxGroup control={form.control} name="accessory" label="Accessory/Usage Issues" options={ACCESSORY_OPTIONS} />
                {/* ✅ Only Connectivity has "Other" in checklist */}
                <CheckboxGroup control={form.control} name="connectivity" label="Connectivity Issues" options={CONNECTIVITY_OPTIONS} />
              </div>
            </div>

            {/* Troubleshooting Steps */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Troubleshooting Steps Attempted</h3>
              <p className="text-sm text-muted-foreground">What steps have you already tried to resolve the issue?</p>
              <CheckboxGroup control={form.control} name="steps" label="Steps Taken" options={STEPS_OPTIONS} />
            </div>

            {/* Resolution & Next Steps */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Resolution & Next Steps</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <FormField control={form.control} name="resolved" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Was the issue resolved?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="contactName" render={({ field }) => (
                  <FormItem><FormLabel>Contact Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="contactEmail" render={({ field }) => (
                  <FormItem><FormLabel>Contact Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResolvedHowCheckboxes control={form.control} />
                <FormField control={form.control} name="nextAction" render={({ field }) => (
                  <FormItem>
                    <FormLabel>If NO — next course of action</FormLabel>
                    <FormControl><Textarea className="h-24" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" disabled={isPending} className="px-8">
                {isPending ? "Saving..." : "Save Record"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}