'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Complete media details with all slugs
const mediaDetails = [
  {
    id: 1,
    slug: "diemex-2025-inauguration",
    title: "Diemex 2025 Inauguration",
    shortText: "Diemex2025 Inauguration Ceremony",
    images: [
      { src: "/images/media-gallery/20205IN_1.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_2.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_3.JPG", alt: "Diemex©25 Inauguration" },     
      { src: "/images/media-gallery/20205IN_4.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_5.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_6.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_7.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_8.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_9.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_10.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_11.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_12.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_13.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_14.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_15.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_16.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_17.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_18.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_19.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_20.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_21.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_22.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_23.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_24.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_25.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_26.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_27.JPG", alt: "Diemex©25 Inauguration" }, 
      { src: "/images/media-gallery/20205IN_28.JPG", alt: "Diemex©25 Inauguration" },
      { src: "/images/media-gallery/20205IN_29.JPG", alt: "Diemex©25 Inauguration" },
       { src: "/images/media-gallery/20205IN_30.JPG", alt: "Diemex©25 Inauguration" },
    ]
  },
  {
    id: 2,
    slug: "diemex-2025-exhibition",
    title: "Diemex 2025 Exhibition",
    shortText: "Diemex2025 Exhibition Highlights",
    images: [
      // You'll need to check what your exhibition files are named
      // They might be 20205EX_1.jpg etc or you might need to add them
      { src: "/images/media-gallery/EX25_1.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_2.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_3.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_4.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_5.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_6.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_7.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_8.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_9.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_10.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_11.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_12.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_13.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_14.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_15.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_16.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_17.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_18.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_19.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_20.JPG", alt: "Diemex 2025 Exhibition" },
        { src: "/images/media-gallery/EX25_21.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_22.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_23.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_24.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_25.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_26.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_27.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_28.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_29.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_30.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_31.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_32.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_33.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_34.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_35.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_36.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_37.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_38.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_39.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_40.JPG", alt: "Diemex 2025 Exhibition" },
        { src: "/images/media-gallery/EX25_41.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_42.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_43.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_44.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_45.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_46.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_47.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_48.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_49.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_50.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_51.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_52.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_53.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_54.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_55.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_56.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_57.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_58.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_59.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_60.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_61.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_62.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_63.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_64.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_65.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_66.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_67.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_68.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_69.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_70.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_71.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_72.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_73.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_74.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_75.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_76.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_77.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_78.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_79.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_80.JPG", alt: "Diemex 2025 Exhibition" },
        { src: "/images/media-gallery/EX25_81.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_82.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_83.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_84.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_85.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_86.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_87.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_88.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_89.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_90.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_91.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_92.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_93.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_94.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_95.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_96.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_97.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_98.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_99.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_100.JPG", alt: "Diemex 2025 Exhibition" },
        { src: "/images/media-gallery/EX25_101.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_102.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_103.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_104.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_105.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_106.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_107.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_108.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_109.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_110.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_111.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_112.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_113.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_114.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_115.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_116.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_117.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_118.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_119.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_120.JPG", alt: "Diemex 2025 Exhibition" },
      { src: "/images/media-gallery/EX25_121.JPG", alt: "Diemex 2025 Exhibition" },
    ]
  },
  {
    id: 3,
    slug: "diemex-2025-awards",
    title: "Diemex 2025 Awards Ceremony",
    shortText: "Diemex2025 Awards Ceremony",
    images: [
      // You'll need to check what your awards files are named
      { src: "/images/media-gallery/AW_1.JPG", alt: "Diemex 2025 Awards" },
      { src: "/images/media-gallery/AW_2.JPG", alt: "Diemex 2025 Awards" },
      { src: "/images/media-gallery/AW_3.JPG", alt: "Diemex 2025 Awards" },
      { src: "/images/media-gallery/AW_4.JPG", alt: "Diemex 2025 Awards" },
      { src: "/images/media-gallery/AW_5.JPG", alt: "Diemex 2025 Awards" },
      { src: "/images/media-gallery/AW_6.JPG", alt: "Diemex 2025 Awards" },
      { src: "/images/media-gallery/AW_7.JPG", alt: "Diemex 2025 Awards" },
      { src: "/images/media-gallery/AW_8.JPG", alt: "Diemex 2025 Awards" },
      { src: "/images/media-gallery/AW_9.JPG", alt: "Diemex 2025 Awards" },
      { src: "/images/media-gallery/AW_10.JPG", alt: "Diemex 2025 Awards" },
      { src: "/images/media-gallery/AW_11.JPG", alt: "Diemex 2025 Awards" },
      { src: "/images/media-gallery/AW_12.JPG", alt: "Diemex 2025 Awards" },
      { src: "/images/media-gallery/AW_13.JPG", alt: "Diemex 2025 Awards" },
      { src: "/images/media-gallery/AW_14.JPG", alt: "Diemex 2025 Awards" },
      { src: "/images/media-gallery/AW_15.JPG", alt: "Diemex 2025 Awards" },
      { src: "/images/media-gallery/AW_16.JPG", alt: "Diemex 2025 Awards" },
      { src: "/images/media-gallery/AW_17.JPG", alt: "Diemex 2025 Awards" },
      { src: "/images/media-gallery/AW_18.JPG", alt: "Diemex 2025 Awards" },
      { src: "/images/media-gallery/AW_19.JPG", alt: "Diemex 2025 Awards" },
      { src: "/images/media-gallery/AW_20.JPG", alt: "Diemex 2025 Awards" },
      { src: "/images/media-gallery/AW_21.JPG", alt: "Diemex 2025 Awards" },
      { src: "/images/media-gallery/AW_22.JPG", alt: "Diemex 2025 Awards" },
      { src: "/images/media-gallery/AW_23.JPG", alt: "Diemex 2025 Awards" },
      { src: "/images/media-gallery/AW_24.JPG", alt: "Diemex 2025 Awards" },
      
    ]
  },
  // For 2023 galleries, you'll need to check those filenames too
  {
    id: 4,
    slug: "diemex-2023-inauguration",
    title: "Diemex 2023 Inauguration",
    shortText: "Diemex2023 Inauguration Ceremony",
    images: [
     { src: "/images/media-gallery/2023IN_1.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_2.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_3.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_4.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_5.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_6.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_7.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_8.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_9.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_10.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_11.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_12.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_13.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_14.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_15.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_16.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_17.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_18.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_19.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_20.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_21.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_22.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_23.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_24.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_25.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_26.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_27.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_28.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_29.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_30.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_31.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_32.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_33.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_34.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_35.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_36.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_37.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_38.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_39.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_40.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_41.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_42.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_43.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_44.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_45.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_46.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_47.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_48.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_49.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_50.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_51.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_52.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_53.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_54.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_55.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_56.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_57.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_58.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_59.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_60.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_61.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_62.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_63.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_64.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_65.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_66.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_67.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_68.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_69.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_70.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_71.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_72.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_73.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_74.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_75.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_76.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_77.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_78.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_79.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_80.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_81.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_82.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_83.webp", alt: "Diemex 2023 Inauguration" },
{ src: "/images/media-gallery/2023IN_84.webp", alt: "Diemex 2023 Inauguration" },
  
            // Add more 2023 images based on your actual files
    ]
  },
  {
    id: 5,
    slug: "diemex-2023-exhibition",
    title: "Diemex 2023 Exhibition",
    shortText: "Diemex2023 Exhibition Highlights",
    images: [
     
       { src: "/images/media-gallery/EX23_1.webp", alt: "Diemex 2023"},
       { src: "/images/media-gallery/EX23_2.webp", alt: "Diemex 2023"},
       { src: "/images/media-gallery/EX23_3.webp", alt: "Diemex 2023"},
       { src: "/images/media-gallery/EX23_4.webp", alt: "Diemex 2023"},
       { src: "/images/media-gallery/EX23_5.webp", alt: "Diemex 2023"},
       { src: "/images/media-gallery/EX23_6.webp", alt: "Diemex 2023"},
       { src: "/images/media-gallery/EX23_7.webp", alt: "Diemex 2023"},
       { src: "/images/media-gallery/EX23_8.webp", alt: "Diemex 2023"},
       { src: "/images/media-gallery/EX23_9.webp", alt: "Diemex 2023"},
       { src: "/images/media-gallery/EX23_10.webp", alt: "Diemex 2023"},
     { src: "/images/media-gallery/EX23_11.webp", alt: "Diemex 2023"},
       { src: "/images/media-gallery/EX23_12.webp", alt: "Diemex 2023"},
       { src: "/images/media-gallery/EX23_13.webp", alt: "Diemex 2023"},
       { src: "/images/media-gallery/EX23_14.webp", alt: "Diemex 2023"},
       { src: "/images/media-gallery/EX23_15.webp", alt: "Diemex 2023"},
       { src: "/images/media-gallery/EX23_16.webp", alt: "Diemex 2023"},
       { src: "/images/media-gallery/EX23_17.webp", alt: "Diemex 2023"},
       { src: "/images/media-gallery/EX23_18.webp", alt: "Diemex 2023"},
       { src: "/images/media-gallery/EX23_19.webp", alt: "Diemex 2023"},
       { src: "/images/media-gallery/EX23_20.webp", alt: "Diemex 2023"},
       { src: "/images/media-gallery/EX23_21.webp", alt:"Diemex 2023"},
       { src: "/images/media-gallery/EX23_22.webp", alt: "Diemex 2023"},
       { src: "/images/media-gallery/EX23_23.webp", alt: "Diemex 2023"},
       { src: "/images/media-gallery/EX23_24.webp", alt: "Diemex 2023"},
      { src: "/images/media-gallery/EX23_25.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_26.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_27.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_28.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_29.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_30.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_31.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_32.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_33.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_34.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_35.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_36.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_37.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_38.webp", alt:"Diemex 2023"},
{ src: "/images/media-gallery/EX23_39.webp", alt:"Diemex 2023"},
{ src: "/images/media-gallery/EX23_40.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_41.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_42.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_43.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_44.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_45.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_46.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_47.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_48.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_49.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_50.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_51.webp", alt:"Diemex 2023"},
{ src: "/images/media-gallery/EX23_52.webp", alt:"Diemex 2023"},
{ src: "/images/media-gallery/EX23_53.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_54.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_55.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_56.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_57.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_58.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_59.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_60.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_61.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_62.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_63.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_64.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_65.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_66.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_67.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_68.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_69.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_70.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_71.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_72.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_73.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_74.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_75.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_76.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_77.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_78.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_79.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_80.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_81.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_82.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_83.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_84.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_85.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_86.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_87.webp", alt:"Diemex 2023"},
{ src: "/images/media-gallery/EX23_88.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_89.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_90.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_91.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_92.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_93.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_94.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_95.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_96.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_97.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_98.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_99.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_100.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_101.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_102.webp", alt:"Diemex 2023"},
{ src: "/images/media-gallery/EX23_103.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_104.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_105.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_106.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_107.webp", alt: "Diemex 2023"},
      { src: "/images/media-gallery/EX23_107.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_108.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_109.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_110.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_111.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_112.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_113.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_114.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_115.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_116.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_117.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_118.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_119.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_120.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_121.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_122.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_123.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_124.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_125.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_126.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_127.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_128.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_129.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_130.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_131.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_132.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_133.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_134.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_135.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_136.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_137.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_138.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_139.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_140.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_141.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_142.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_143.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_144.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_145.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_146.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_147.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_148.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_149.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_150.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_151.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_152.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_153.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_154.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_155.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_156.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_157.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_158.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_159.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_160.webp", alt: "Diemex 2023"},
{ src: "/images/media-gallery/EX23_161.webp", alt: "Diemex 2023" },
{ src: "/images/media-gallery/EX23_162.webp", alt: "Diemex 2023" },
{ src: "/images/media-gallery/EX23_163.webp", alt: "Diemex 2023" },
{ src: "/images/media-gallery/EX23_164.webp", alt: "Diemex 2023" },
{ src: "/images/media-gallery/EX23_165.webp", alt: "Diemex 2023 " },
{ src: "/images/media-gallery/EX23_166.webp", alt: "Diemex 2023 " },
{ src: "/images/media-gallery/EX23_167.webp", alt: "Diemex 2023 " },
{ src: "/images/media-gallery/EX23_168.webp", alt: "Diemex 2023 " },
{ src: "/images/media-gallery/EX23_169.webp", alt: "Diemex 2023 " },
{ src: "/images/media-gallery/EX23_170.webp", alt: "Diemex 2023 " },
       



      // Add more 2023 images based on your actual files
    ]
  },
  {
    id: 6,
    slug: "diemex-2023-awards",
    title: "Diemex 2023 Awards Ceremony",
    shortText: "Diemex2023 Awards Ceremony",
    images: [
      { src: "/images/media-gallery/AW23_1.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_2.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_3.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_4.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_5.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_6.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_7.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_8.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_9.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_10.webp", alt: "Diemex 2023 Awards" },
     { src: "/images/media-gallery/AW23_11.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_12.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_13.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_14.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_15.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_16.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_17.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_18.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_19.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_20.webp", alt: "Diemex 2023 Awards" },
           { src: "/images/media-gallery/AW23_21.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_22.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_23.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_24.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_25.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_26.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_27.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_28.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_29.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_30.JPG", alt: "Diemex 2023 Awards" },
           { src: "/images/media-gallery/AW23_31.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_32.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_33.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_34.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_35.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_36.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_37.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_38.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_39.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_40.webp", alt: "Diemex 2023 Awards" },
           { src: "/images/media-gallery/AW23_41.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_42.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_43.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_44.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_45.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_46.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_47.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_48.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_49.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_50.webp", alt: "Diemex 2023 Awards" },
        { src: "/images/media-gallery/AW23_51.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_52.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_53.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_54.webp", alt: "Diemex 2023 Awards" },
      { src: "/images/media-gallery/AW23_55.webp", alt: "Diemex 2023 Awards" },
      // Add more 2023 images based on your actual files
    ]
  }
];

// Lightbox/Modal Component (keep this exactly as you had it)
function LightboxModal({ 
  isOpen, 
  onClose, 
  images, 
  currentIndex, 
  onNext, 
  onPrev 
}: {
  isOpen: boolean;
  onClose: () => void;
  images: { src: string; alt: string }[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        onNext();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 text-white text-3xl z-[1001] p-2 hover:bg-white/10 rounded-full backdrop-blur-sm transition-all duration-200"
        aria-label="Close lightbox"
      >
        ✕
      </button>

      {/* Navigation Buttons */}
      <button
        onClick={onPrev}
        className="fixed left-6 top-1/2 -translate-y-1/2 text-white p-4 hover:bg-white/10 rounded-full backdrop-blur-sm z-[1001] transition-all duration-200"
        aria-label="Previous image"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>

      <button
        onClick={onNext}
        className="fixed right-6 top-1/2 -translate-y-1/2 text-white p-4 hover:bg-white/10 rounded-full backdrop-blur-sm z-[1001] transition-all duration-200"
        aria-label="Next image"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>

      {/* Image Counter */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-white text-lg bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm z-[1001]">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Main Image */}
      <div className="relative w-full h-full max-w-7xl mx-auto p-4">
        <div className="relative w-full h-full">
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            className="object-contain w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

export default function MediaGallerySlugPage() {
  const params = useParams();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mediaItem, setMediaItem] = useState<any>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    // Find the media item based on the slug
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    const item = mediaDetails.find(item => item.slug === slug);
    setMediaItem(item);

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [params.slug]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    if (mediaItem) {
      setLightboxIndex((prev) => (prev + 1) % mediaItem.images.length);
    }
  };

  const prevImage = () => {
    if (mediaItem) {
      setLightboxIndex((prev) => (prev - 1 + mediaItem.images.length) % mediaItem.images.length);
    }
  };

  if (!mediaItem) {
    return (
      <div className="min-h-screen font-parabolica antialiased flex items-center justify-center">
        <div className="text-center">
          <h2 className="title-72 text-black mb-4">Media Item Not Found</h2>
          <Link href="/media-gallery" className="text-mainColor1 hover:underline">
            Back to Media Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-parabolica antialiased">
      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        images={mediaItem.images}
        currentIndex={lightboxIndex}
        onNext={nextImage}
        onPrev={prevImage}
      />

      {/* Back to Top Button */}
      <div className={`fixed bottom-3 right-3 lg:bottom-10 lg:right-2 z-50 transition-all duration-300 ${showBackToTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <button
          aria-label="Back to top"
          onClick={scrollToTop}
          className="m-0 rounded-full border-none bg-[#b0cbdf] p-0 outline-none drop-shadow-lg"
        >
          <svg className="size-10 fill-mainColor1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M22 12c0-5.522-4.476-10-10-10C6.479 2 2 6.479 2 12c0 5.524 4.478 10 10 10c5.524 0 10-4.476 10-10zm-14.53.28a.75.75 0 0 1-.073-.976l.073-.084l4-4a.75.75 0 0 1 .977-.073l.085.072l4 4.002a.75.75 0 0 1-.977 1.133l-.084-.073l-2.72-2.721v6.691a.75.75 0 0 1-.649.743l-.102.007a.75.75 0 0 1-.743-.648l-.007-.102v-6.69l-2.72 2.72a.75.75 0 0 1-.976.072l-.084-.072z"></path>
          </svg>
        </button>
      </div>

      {/* Page Content */}
      <div className="page-spacing-wrapper">
        {/* Header Section */}
        <div className="container pb-10 pt-48 mt-10">
          <h2 className="title-72 text-black">{mediaItem.title}</h2>
          <div className="mt-10 flex flex-col justify-between lg:flex-row lg:items-end gap-10 lg:gap-32">
            <div className="rte-style">
              <p className="text-gray-600">{mediaItem.shortText}</p>
            </div>
          </div>
        </div>

        {/* Image Grid */}
        <div className="container my-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {mediaItem.images.map((image: { src: string; alt: string }, index: number) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 bg-white cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                {/* Image Container with Fixed Aspect Ratio */}
                <div className="relative aspect-square w-full overflow-hidden">
                  <div
                    className="global-transition size-full cursor-pointer focus:outline-none"
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                </div>
                
                {/* Optional overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm truncate">{image.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="container mb-20 mt-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link
              href="/media-gallery"
              className="flex items-center text-mainColor1 hover:underline px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Media Gallery
            </Link>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-mainColor1 hover:underline px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Back to Top
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}