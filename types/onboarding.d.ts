export type StepProps<T> = {
    onNext: (answer: T) => void;
}