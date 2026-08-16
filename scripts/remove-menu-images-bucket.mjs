import { createClient } from "@supabase/supabase-js";

const BUCKET_ID = "menu-images";
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before removing the menu image bucket.",
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const { data: bucket, error: bucketError } = await supabase.storage.getBucket(BUCKET_ID);

if (bucketError) {
  if (bucketError.statusCode === "404" || bucketError.status === 404) {
    console.log(`Storage bucket ${BUCKET_ID} is already removed.`);
    process.exit(0);
  }
  throw bucketError;
}

if (bucket) {
  const { error: emptyError } = await supabase.storage.emptyBucket(BUCKET_ID);
  if (emptyError) throw emptyError;

  const { error: deleteError } = await supabase.storage.deleteBucket(BUCKET_ID);
  if (deleteError) throw deleteError;
}

console.log(`Storage bucket ${BUCKET_ID} and its objects were removed.`);
