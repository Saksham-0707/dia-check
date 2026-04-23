export type PredictionFieldOption = {
  label: string;
  value: string;
};

export type PredictionField = {
  name: string;
  label: string;
  type: "number" | "select";
  helper: string;
  step?: string;
  min?: number;
  max?: number;
  options?: PredictionFieldOption[];
};

const yesNoOptions: PredictionFieldOption[] = [
  { label: "No", value: "0" },
  { label: "Yes", value: "1" },
];

const lowMediumHighOptions: PredictionFieldOption[] = [
  { label: "Low", value: "0" },
  { label: "Moderate", value: "1" },
  { label: "High", value: "2" },
];

export const predictionFields: PredictionField[] = [
  {
    name: "HbA1c",
    label: "HbA1c",
    type: "number",
    helper: "Hemoglobin A1c percentage",
    step: "0.1",
    min: 0,
    max: 20,
  },
  {
    name: "Age",
    label: "Age",
    type: "number",
    helper: "Age in years",
    step: "1",
    min: 1,
    max: 120,
  },
  {
    name: "BMI",
    label: "BMI",
    type: "number",
    helper: "Body mass index",
    step: "0.1",
    min: 0,
    max: 100,
  },
  {
    name: "FrequentUrination",
    label: "Frequent Urination",
    type: "select",
    helper: "Frequent urination symptoms",
    options: yesNoOptions,
  },
  {
    name: "Hypertension",
    label: "Hypertension",
    type: "select",
    helper: "Known high blood pressure",
    options: yesNoOptions,
  },
  {
    name: "ExcessiveThirst",
    label: "Excessive Thirst",
    type: "select",
    helper: "Excessive thirst symptoms",
    options: yesNoOptions,
  },
  {
    name: "UnexplainedWeightLoss",
    label: "Unexplained Weight Loss",
    type: "select",
    helper: "Recent unexplained weight loss",
    options: yesNoOptions,
  },
  {
    name: "FatigueLevels",
    label: "Fatigue Levels",
    type: "select",
    helper: "Typical fatigue level",
    options: lowMediumHighOptions,
  },
  {
    name: "BlurredVision",
    label: "Blurred Vision",
    type: "select",
    helper: "Blurred vision symptoms",
    options: yesNoOptions,
  },
  {
    name: "SlowHealingSores",
    label: "Slow Healing Sores",
    type: "select",
    helper: "Slow healing sores or wounds",
    options: yesNoOptions,
  },
  {
    name: "TinglingHandsFeet",
    label: "Tingling Hands Feet",
    type: "select",
    helper: "Tingling in hands or feet",
    options: yesNoOptions,
  },
  {
    name: "SleepQuality",
    label: "Sleep Quality",
    type: "select",
    helper: "Typical sleep quality",
    options: lowMediumHighOptions,
  },
  {
    name: "PhysicalActivity",
    label: "Physical Activity",
    type: "select",
    helper: "Typical activity level",
    options: lowMediumHighOptions,
  },
  {
    name: "DietQuality",
    label: "Diet Quality",
    type: "select",
    helper: "Typical diet quality",
    options: lowMediumHighOptions,
  },
  {
    name: "AlcoholConsumption",
    label: "Alcohol Consumption",
    type: "select",
    helper: "Alcohol consumption frequency",
    options: lowMediumHighOptions,
  },
  {
    name: "EducationLevel",
    label: "Education Level",
    type: "select",
    helper: "Highest education level",
    options: [
      { label: "Primary", value: "0" },
      { label: "Secondary", value: "1" },
      { label: "Graduate", value: "2" },
      { label: "Postgraduate", value: "3" },
    ],
  },
  {
    name: "SocioeconomicStatus",
    label: "Socioeconomic Status",
    type: "select",
    helper: "Socioeconomic category",
    options: lowMediumHighOptions,
  },
  {
    name: "HealthLiteracy",
    label: "Health Literacy",
    type: "select",
    helper: "Health literacy level",
    options: lowMediumHighOptions,
  },
  {
    name: "QualityOfLifeScore",
    label: "Quality Of Life Score",
    type: "number",
    helper: "Quality of life score",
    step: "1",
    min: 0,
    max: 100,
  },
  {
    name: "Ethnicity",
    label: "Ethnicity",
    type: "select",
    helper: "Ethnicity category used by the trained model",
    options: [
      { label: "Category 0", value: "0" },
      { label: "Category 1", value: "1" },
      { label: "Category 2", value: "2" },
      { label: "Category 3", value: "3" },
    ],
  },
  {
    name: "Gender",
    label: "Gender",
    type: "select",
    helper: "Gender category used by the trained model",
    options: [
      { label: "Female", value: "0" },
      { label: "Male", value: "1" },
      { label: "Other", value: "2" },
    ],
  },
  {
    name: "FamilyHistoryDiabetes",
    label: "Family History Diabetes",
    type: "select",
    helper: "Family history of diabetes",
    options: yesNoOptions,
  },
  {
    name: "PreviousPreDiabetes",
    label: "Previous Pre Diabetes",
    type: "select",
    helper: "Previous pre-diabetes diagnosis",
    options: yesNoOptions,
  },
  {
    name: "GestationalDiabetes",
    label: "Gestational Diabetes",
    type: "select",
    helper: "Gestational diabetes history",
    options: yesNoOptions,
  },
  {
    name: "PolycysticOvarySyndrome",
    label: "Polycystic Ovary Syndrome",
    type: "select",
    helper: "PCOS history",
    options: yesNoOptions,
  },
  {
    name: "MedicalCheckupsFrequency",
    label: "Medical Checkups Frequency",
    type: "select",
    helper: "Medical checkup frequency",
    options: [
      { label: "Rarely", value: "0" },
      { label: "Yearly", value: "1" },
      { label: "Every 6 months", value: "2" },
      { label: "Every 3 months", value: "3" },
    ],
  },
  {
    name: "WaterQuality",
    label: "Water Quality",
    type: "select",
    helper: "Drinking water quality",
    options: lowMediumHighOptions,
  },
  {
    name: "OccupationalExposureChemicals",
    label: "Occupational Exposure Chemicals",
    type: "select",
    helper: "Workplace chemical exposure",
    options: yesNoOptions,
  },
];
