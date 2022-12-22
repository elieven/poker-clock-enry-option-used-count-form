import { z } from "zod";
import create from "zustand";
import shallow from "zustand/shallow";
import { nanoid } from "nanoid";
import { useForm, useFieldArray } from "react-hook-form";
import { entryOptionSchema, EntryOption } from "./types";

//
// zod schemas
//

const formDataSchema = z.object({
  entryOptions: z.array(entryOptionSchema)
});

//
// types
//

type FormData = z.infer<typeof formDataSchema>;

//
// utility functions
//

function makeOption(index: number = 0): EntryOption {
  return {
    _id: nanoid(),
    name: `Option ${index + 1}`,
    cost: 20,
    rake: 2,
    chips: 25000
  };
}

//
// default values
//

const defaultValues = {
  entryOptions: new Array(2).fill(1).map((_, i) => makeOption(i))
};

//
// zustand store
//

/**
 * Store and FormData currently happen to have the same type so we can reuse it
 * later on that would need to be ammendded.
 */

const store = create<FormData>()(() => ({
  entryOptions: defaultValues.entryOptions
}));

// TODO: use a working comparison function shallow won't do shit
const useEntryOptions = () => store((state) => state.entryOptions, shallow);

//
// actual components
//

// TODO: add a reset form state button to whatever is in store

const EntryOptionsForm = () => {
  const { control, register, handleSubmit, watch } = useForm<FormData>({
    defaultValues
  });

  const optionsFieldArray = useFieldArray({
    control,
    name: "entryOptions"
  });

  const storeEntryOptions = useEntryOptions();
  const formEntryOptions = watch("entryOptions");

  return (
    <form
      onSubmit={handleSubmit((data) =>
        store.setState({ entryOptions: data.entryOptions })
      )}
    >
      <h3>Entry options</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Cost</th>
            <th>Rake</th>
            <th>Chips</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {optionsFieldArray.fields.map((field, index) => {
            const rmvOption = () => optionsFieldArray.remove(index);
            return (
              <tr key={field.id}>
                <td>
                  <input
                    type="text"
                    {...register(`entryOptions.${index}.name` as const, {
                      required: { value: true, message: "Required!!!" }
                    })}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    defaultValue={field.cost}
                    {...register(`entryOptions.${index}.cost` as const, {
                      valueAsNumber: true,
                      required: { value: true, message: "Required!!!" },
                      min: {
                        value: 0,
                        message: "Must be more than 0"
                      }
                    })}
                    min={0}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    {...register(`entryOptions.${index}.rake` as const, {
                      valueAsNumber: true,
                      required: { value: true, message: "Required!!!" },
                      min: {
                        value: 0,
                        message: "Must be more than 0"
                      }
                    })}
                    min={0}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    defaultValue={field.chips}
                    {...register(`entryOptions.${index}.chips` as const, {
                      valueAsNumber: true,
                      required: { value: true, message: "Required!!!" },
                      min: {
                        value: 0,
                        message: "Must be more than 0"
                      }
                    })}
                    min={0}
                  />
                </td>
                <td>
                  <button type="button" onClick={rmvOption}>
                    -
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        {JSON.stringify(formEntryOptions) === JSON.stringify(storeEntryOptions)
          ? ""
          : "You have some unsaved changes. Click submit to save them."}
      </div>
      <br />
      <div>
        <button
          type="button"
          onClick={() => {
            const option = makeOption(optionsFieldArray.fields.length);
            optionsFieldArray.append(option);
          }}
        >
          Add option
        </button>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

const EntryOptionsUsedCountForm = () => {
  return (
    <>
      <h3>Entry options used count</h3>
    </>
  );
};

export default function App() {
  return (
    <>
      <EntryOptionsForm />
      <br />
      <EntryOptionsUsedCountForm />
    </>
  );
}
