import { useRouter } from "next/dist/client/router";
import { client, getProfile, getPublications } from "../../api";
import { useState, useEffect } from "react";
import Image from "next/dist/client/image";
import styles from "../../styles/Home.module.css";
import { ethers } from "ethers";

import ABI from "../../abi.json";
const address = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { AbiCoder } from "ethers/lib/utils";

export default function profile() {
  const [profile, setProfile] = useState();
  const [pubs, setPubs] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  async function fetchProfile() {
    try {
      const response = await client.query(getProfile, { id }).toPromise();
      console.log({ response });
      setProfile(response.data.profiles.items[0]);

      const publications = await client
        .query(getPublications, { id })
        .toPromise();
      console.log({ publications });
      setPubs(publications.data.publications.items);
    } catch (err) {
      console.log(err);
    }
  }

  async function connect() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log({ accounts });
  }

  async function followUser() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(address, ABI, signer);
    try {
      const tx = await contract.follow([id], [0x0]);
      await tx.wait();
      console.log("followed successfully ... ");
    } catch (err) {
      console.log(err);
    }
  }

  if (!profile) return null;

  return (
    <div className={styles.container}>
      <button onClick={connect}>Connect</button>
      <div>
        {profile.picture ? (
          <Image
            src={profile.picture.original.url}
            width="200px"
            height="200px"
          />
        ) : (
          <div className={styles.blackbox} />
        )}
      </div>
      <div>
        <h2>{profile.handle}</h2>
        <p> {profile.bio}</p>
        <p> Followers : {profile.stats.totalFollowers} </p>
        <p> Following : {profile.stats.totalFollowing} </p>
        <button onClick={followUser}>Follow User</button>
      </div>
      <div>
        {pubs.map((pub, index) => (
          <div className={styles.pub}>{pub.metadata.content}</div>
        ))}
      </div>
    </div>
  );
}
