"use client"

import { FC, useMemo } from 'react';
import styles from './index.module.scss';
import { data } from './data';
import { TeamMemberFrame } from './teamMemberFrame';
import { Image, Box, Text } from '@chakra-ui/react';


export const AboutPage: FC = () => {

  console.log(`data: ${data}`);

  return (
      <Box className={styles['container']}>
        <Box className={styles['title-holder']}>
          <Box className={styles['title-row']}>
            <Box className={styles['title']}>
              Our <br/> Visionaries
            </Box>
            <Image  alt="down-arrow" className={styles['title-arrow']} src="down-arrow.svg"/>
          </Box>
        </Box>

        <Box className={styles['eboard_box']}>
    

          <Box className={styles['team-row']}>
            {data?.map((memberList): JSX.Element => {
              const memberPosCategory = memberList?.[0]?.memberType.memberPosCategory;
              
              console.log(`memberList: ${JSON.stringify(memberList)}`)
              return (
                <>
                  <Box className={styles['team-row-container']}>
                    <Box className={styles['double_wide_text_box']}>
                      <Text className={styles['team_header']}>{memberPosCategory?.memberTypeCategory}</Text>
                      <Text className={styles['team_description']}>{memberPosCategory?.memberTypeCategoryDescription}</Text>
                    </Box>
                    <Box className={styles['team-row']}>
                      { memberList?.members?.map((member) => {
                        console.log(`member: ${JSON.stringify(member)}`)
                        return ( 
                          <TeamMemberFrame
                            key={member.id}
                            firstName={member.firstName}
                            lastName={member.lastName}
                            imageURL={member.imageURL}
                            memberType={member.memberType}
                            githubURL={member.githubURL ?? ''}
                            personalURL={member.personalURL ?? ''}
                            linkedinURL={member.linkedinURL ?? ''}
                          />
                        );})
                      }
                    </Box>
                  </Box>
                </>
              );
            })
            }
          </Box>
        </Box>
      </Box>
  );
};

export default AboutPage;
