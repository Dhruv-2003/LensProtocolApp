// import Head from "next/head";
// import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import { client, recommendedProfiles } from "../api";

import Link from "next/link";
import Image from "next/dist/client/image";
export default function Home() {
  useEffect(() => {
    fetchProfiles();
  }, []);

  const [profiles, setProfiles] = useState([]);

  async function fetchProfiles() {
    try {
      const response = await client.query(recommendedProfiles).toPromise();
      console.log({ response });
      setProfiles(response.data.recommendedProfiles);
    } catch (err) {
      console.log({ err });
    }
  }
  return (
    <div className={styles.container}>
      {profiles.map((profile, index) => (
        <Link href={`/profile/${profile.id}`}>
          <a>
            <div>
              {profile.picture ? (
                <Image
                  src={profile.picture.original.url}
                  width="60px"
                  height="60px"
                />
              ) : (
                <div className={styles.blankPhotoStyle} />
              )}
              <h4>{profile.handle}</h4>
              <p>{profile.bio}</p>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
}
