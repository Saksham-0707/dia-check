export type PredictionFieldOption = {
  label: string;
  value: number;
};

export type PredictionField = {
  name: string;
  label: string;
  type: "number" | "select" | "slider";
  helper: string;
  placeholder?: string;
  step?: string;
  min?: number;
  max?: number;
  options?: PredictionFieldOption[];
};

const yesNoOptions: PredictionFieldOption[] = [
  { label: "No", value: 0 },
  { label: "Yes", value: 1 },
];

export const predictionFields: PredictionField[] = [
  {
    name: "HbA1c",
    label: "HbA1c (%)",
    type: "number",
    helper: "Typical range: 4.0 - 10.0",
    placeholder: "Example: 5.7",
    step: "0.1",
    min: 4,
    max: 10,
  },
  {
    name: "Age",
    label: "Age",
    type: "number",
    helper: "Enter age in years (20-90)",
    placeholder: "Example: 45",
    step: "1",
    min: 20,
    max: 90,
  },
  {
    name: "BMI",
    label: "BMI",
    type: "number",
    helper: "Body Mass Index (15-40)",
    placeholder: "Example: 24.8",
    step: "0.1",
    min: 15,
    max: 40,
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
    type: "slider",
    helper: "Rate fatigue from 0 (none) to 10 (severe)",
    step: "1",
    min: 0,
    max: 10,
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
    type: "slider",
    helper: "Rate sleep quality from 4 (poor) to 10 (excellent)",
    step: "1",
    min: 4,
    max: 10,
  },
  {
    name: "PhysicalActivity",
    label: "Physical Activity",
    type: "slider",
    helper: "Hours of physical activity per week (0-10)",
    step: "1",
    min: 0,
    max: 10,
  },
  {
    name: "DietQuality",
    label: "Diet Quality",
    type: "slider",
    helper: "Rate diet quality from 0 (poor) to 10 (excellent)",
    step: "1",
    min: 0,
    max: 10,
  },
  {
    name: "AlcoholConsumption",
    label: "Alcohol Consumption",
    type: "number",
    helper: "Alcohol units per week (0-20)",
    placeholder: "Example: 2",
    step: "1",
    min: 0,
    max: 20,
  },
  {
    name: "EducationLevel",
    label: "Education Level",
    type: "select",
    helper: "Highest education level",
    options: [
      { label: "None", value: 0 },
      { label: "High School", value: 1 },
      { label: "Bachelor's", value: 2 },
      { label: "Higher", value: 3 },
    ],
  },
  {
    name: "SocioeconomicStatus",
    label: "Socioeconomic Status",
    type: "select",
    helper: "Socioeconomic category",
    options: [
      { label: "Low", value: 0 },
      { label: "Middle", value: 1 },
      { label: "High", value: 2 },
    ],
  },
  {
    name: "HealthLiteracy",
    label: "Health Literacy",
    type: "slider",
    helper: "Rate health literacy from 0 (low) to 10 (high)",
    step: "1",
    min: 0,
    max: 10,
  },
  {
    name: "QualityOfLifeScore",
    label: "Quality Of Life Score",
    type: "number",
    helper: "Quality of life score (0-100)",
    placeholder: "Example: 72",
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
      { label: "Caucasian", value: 0 },
      { label: "African American", value: 1 },
      { label: "Asian", value: 2 },
      { label: "Other", value: 3 },
    ],
  },
  {
    name: "Gender",
    label: "Gender",
    type: "select",
    helper: "Gender category used by the trained model",
    options: [
      { label: "Male", value: 0 },
      { label: "Female", value: 1 },
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
    type: "number",
    helper: "Medical checkups per year (0-4)",
    placeholder: "Example: 1",
    step: "1",
    min: 0,
    max: 4,
  },
  {
    name: "WaterQuality",
    label: "Water Quality",
    type: "select",
    helper: "Drinking water quality",
    options: [
      { label: "Good", value: 0 },
      { label: "Poor", value: 1 },
    ],
  },
  {
    name: "OccupationalExposureChemicals",
    label: "Occupational Exposure Chemicals",
    type: "select",
    helper: "Workplace chemical exposure",
    options: yesNoOptions,
  },
];
