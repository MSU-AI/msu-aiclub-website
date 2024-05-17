"use client"

import styles from './about.module.scss';
import { Image, Box, Text, HTMLChakraProps } from '@chakra-ui/react';
import  Link  from 'next/link';

export interface TeamMemberData {
  id: string;
  firstName: string;
  lastName: string;
  memberType: MemberTypeObject;
  imageURL: string;
  githubURL?: string;
  linkedinURL?: string;
  personalURL?: string;
}

export type TeamMemberFrameProps = HTMLChakraProps<'div'> & Omit<TeamMemberData, 'id'>;

export const TeamMemberFrame: FC<TeamMemberFrameProps> = ({
  firstName,
  lastName,
  memberType,
  imageURL,
  githubURL,
  linkedinURL,
  personalURL
}) => {
        console.log(`url: ${imageURL}, ${githubURL}, ${linkedinURL}, ${personalURL}`)
       return (
         <>
      <Box className={styles['main-container']}>
        <Image className={styles['photo']} src={imageURL} alt={`${firstName} ${lastName}`} />
        <Box className={styles['text-container']}>
          <Text className={styles['name']}>{`${firstName} ${lastName}`}</Text>
          <Text color={'aiColor'} className={styles['position']}>{memberType.memberTypeName}</Text>
        </Box>
        <Box className={styles['hover-box']} backgroundColor={'aiColor'}>
          {githubURL && (
            <Link href={"/"} className={styles['social-link']}>
              <Image height={'40px'} width={'40px'} alt='github url' src='github.svg'/>
            </Link>
          )}
          {linkedinURL && (
            <Link href={"/"} className={styles['social-link']}>
              <Image height={'40px'} width={'40px'} alt='github url' src='linkedin.svg'/>
            </Link>
          )}
          {personalURL && (
            <Link href={"/"}  className={styles['social-link']}>
              <Image height={'40px'} width={'40px'} alt='github url' src='personal.svg'/>
            </Link>
          )}
        </Box>
      </Box>
    </>
    );
}
