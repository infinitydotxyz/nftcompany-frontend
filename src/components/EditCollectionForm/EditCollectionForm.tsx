import { ChangeEvent, FC, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { CollectionData } from 'services/Collections.service';
import { useAppContext } from 'utils/context/AppContext';
import uniqueId from 'lodash/uniqueId';
import { Button } from '@chakra-ui/button';
import { Box, SimpleGrid, Text } from '@chakra-ui/layout';
import { FormLabel, Input, Textarea, Image } from '@chakra-ui/react';
import HorizontalLine from 'components/HorizontalLine/HorizontalLine';
import { FaImage } from 'react-icons/fa';
import { apiPost } from 'utils/apiUtil';

enum CollectionFormField {
  ProfileImage = 'profileImage',
  Name = 'name',
  Description = 'description',
  Twitter = 'twitter',
  Instagram = 'instagram',
  Facebook = 'facebook',
  Discord = 'discord',
  External = 'external',
  Medium = 'medium',
  Wiki = 'wiki',
  Telegram = 'telegram',
  Benefits = 'benefits',
  Partnerships = 'partnerships'
}

enum InputType {
  Text = 'text',
  ArrayOfText = 'arrayOfText',
  Image = 'image',
  NameAndLinkArray = 'nameAndLinkArray'
}

interface TextInput {
  type: InputType.Text;
  value: string;
}

interface MultipleTextInputs {
  type: InputType.ArrayOfText;
  value: { [id: string]: { value: string } };
}

interface ImageInput {
  type: InputType.Image;
  src: string;
  value?: File;
  isDeleted: boolean;
}

type NameAndLinkInput = { name: string; link: string };

interface NameAndLinkInputs {
  type: InputType.NameAndLinkArray;
  value: { [id: string]: NameAndLinkInput };
}

interface CollectionFormData {
  [CollectionFormField.ProfileImage]: ImageInput;
  [CollectionFormField.Name]: TextInput;
  [CollectionFormField.Description]: TextInput;
  [CollectionFormField.Twitter]: TextInput;
  [CollectionFormField.Instagram]: TextInput;
  [CollectionFormField.Discord]: TextInput;
  [CollectionFormField.Facebook]: TextInput;
  [CollectionFormField.External]: TextInput;
  [CollectionFormField.Medium]: TextInput;
  [CollectionFormField.Wiki]: TextInput;
  [CollectionFormField.Telegram]: TextInput;
  [CollectionFormField.Benefits]: MultipleTextInputs;
  [CollectionFormField.Partnerships]: NameAndLinkInputs;
}

interface FormBody {
  profileImage: {
    /**
     * file is passed through req.files.profileImage
     */
    /**
     * whether the image was deleted
     */
    isDeleted: boolean;
  };
  name: string;
  description: string;
  twitter: string;
  discord: string;
  instagram: string;
  facebook: string;
  external: string;
  medium: string;
  wiki: string;
  telegram: string;
  benefits: string[];
  partnerships: Array<{ name: string; link: string }>;
}

const InputGroupWrapper = (props: { title?: string; children: ReactNode }) => {
  return (
    <Box
      display="flex"
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'flex-start'}
      marginY={'72px'}
      maxWidth={'750px'}
    >
      <Box
        display="flex"
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'flex-start'}
        maxWidth={'750px'}
        minWidth={['500', '600', '700', '750']}
      >
        {props.title && (
          <Text size="xl" variant="bold" marginBottom={'56px'}>
            {props.title}
          </Text>
        )}
        {props.children}
      </Box>
    </Box>
  );
};

const InputWithLabel = (props: {
  title: string;
  placeholder: string;
  value: string;
  name: string;
  datakey?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <Box display="flex" flexDirection={'column'} width="100%" key={props.name}>
      <FormLabel size="lg">{props.title}</FormLabel>
      <Input
        placeholder={props.placeholder}
        value={props.value}
        name={props.name}
        onChange={props.onChange}
        datakey={props.datakey}
      />
    </Box>
  );
};

const EditCollectionForm: FC<{ collectionInfo?: CollectionData; userAddress?: string }> = ({
  collectionInfo,
  userAddress
}): JSX.Element => {
  const [formData, setFormData] = useState<CollectionFormData>({} as any);
  const inputFileRef = useRef<any>();
  const { showAppError, showAppMessage, chainId } = useAppContext();

  const postForm = async () => {
    try {
      const form = new FormData();
      const profileImageFile = formData[CollectionFormField.ProfileImage].value;
      if (profileImageFile) {
        form.append('profileImage', profileImageFile);
      }

      if (userAddress && collectionInfo?.address) {
        const update: FormBody = {
          profileImage: {
            isDeleted: formData[CollectionFormField.ProfileImage].isDeleted
          },
          name: formData[CollectionFormField.Name].value,
          description: formData[CollectionFormField.Description].value,
          twitter: formData[CollectionFormField.Twitter].value,
          discord: formData[CollectionFormField.Discord].value,
          instagram: formData[CollectionFormField.Instagram].value,
          facebook: formData[CollectionFormField.Facebook].value,
          external: formData[CollectionFormField.External].value,
          medium: formData[CollectionFormField.Medium].value,
          wiki: formData[CollectionFormField.Wiki].value,
          telegram: formData[CollectionFormField.Telegram].value,
          benefits: Object.values(formData[CollectionFormField.Benefits].value ?? {})
            .map((item) => item.value)
            .filter((item) => item),
          partnerships: Object.values(formData[CollectionFormField.Partnerships].value ?? {}).filter(
            (item) => item.name && item.link
          )
        };
        form.append('data', JSON.stringify(update));
        const res = await apiPost(
          `/collection/u/${userAddress}/${collectionInfo?.address}`,
          { chainId: chainId || '1' },
          form
        );
        if (res.error) {
          throw res.error;
        } else if (res.status === 201 || res.status === 200) {
          showAppMessage('Collection updated!');
        } else {
          throw new Error(`Unknown error ${res.status}`);
        }
      } else if (!userAddress) {
        throw new Error('Please login');
      } else if (!collectionInfo?.address) {
        throw new Error('Invalid contract address. Please refresh the page');
      }
    } catch (err: any) {
      console.error(err);
      if (err.message) {
        showAppError(`Failed to update collection: ${err.message}`);
      } else {
        showAppError(`Failed to update collection`);
      }
    }
  };

  const getFormDataFromCollectionInfo = (collectionInfo?: CollectionData) => {
    let partnerships = (collectionInfo?.partnerships ?? [])?.reduce(
      (acc: { [id: string]: { name: string; link: string } }, item) => {
        return { ...acc, [uniqueId()]: item };
      },
      {}
    );

    while (Object.keys(partnerships).length < 4) {
      partnerships = { ...partnerships, ...getEmptyNameAndLinkInput() };
    }

    let benefits = (collectionInfo?.benefits ?? [])?.reduce((acc: { [id: string]: { value: string } }, item) => {
      return { ...acc, [uniqueId()]: { value: item } };
    }, {});

    while (Object.keys(benefits).length < 3) {
      benefits = { ...benefits, ...getEmptyMultipleTextInput() };
    }

    const formData: CollectionFormData = {
      [CollectionFormField.ProfileImage]: {
        type: InputType.Image,
        src: collectionInfo?.profileImage ?? '',
        value: undefined,
        isDeleted: false
      },
      [CollectionFormField.Name]: {
        type: InputType.Text,
        value: collectionInfo?.name ?? ''
      },
      [CollectionFormField.Description]: {
        type: InputType.Text,
        value: collectionInfo?.description ?? ''
      },
      [CollectionFormField.Twitter]: {
        type: InputType.Text,
        value: collectionInfo?.links?.twitter ?? ''
      },
      [CollectionFormField.Instagram]: {
        type: InputType.Text,
        value: collectionInfo?.links?.instagram ?? ''
      },
      [CollectionFormField.Facebook]: {
        type: InputType.Text,
        value: collectionInfo?.links?.facebook ?? ''
      },
      [CollectionFormField.Discord]: {
        type: InputType.Text,
        value: collectionInfo?.links?.discord ?? ''
      },
      [CollectionFormField.External]: {
        type: InputType.Text,
        value: collectionInfo?.links?.external ?? ''
      },
      [CollectionFormField.Medium]: {
        type: InputType.Text,
        value: collectionInfo?.links?.medium ?? ''
      },
      [CollectionFormField.Telegram]: {
        type: InputType.Text,
        value: collectionInfo?.links?.telegram ?? ''
      },
      [CollectionFormField.Wiki]: {
        type: InputType.Text,
        value: collectionInfo?.links?.wiki ?? ''
      },
      [CollectionFormField.Benefits]: {
        type: InputType.ArrayOfText,
        value: benefits
      },
      [CollectionFormField.Partnerships]: {
        type: InputType.NameAndLinkArray,
        value: partnerships
      }
    };

    return formData;
  };

  useEffect(() => {
    setFormData(getFormDataFromCollectionInfo(collectionInfo));
  }, [collectionInfo]);

  const onImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    return new Promise<{ src: string; file: File }>((resolve, reject) => {
      if (e?.target?.files?.length) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', (event) => {
          const src = event.target?.result as string;
          resolve({ src, file });
        });
        reader.addEventListener('error', (err) => {
          console.error(err);
          reject(new Error('Failed to read file'));
        });
        reader.readAsDataURL(file);
      } else {
        reject(new Error('Failed to find uploaded files'));
      }
    });
  };

  const onDeleteImageThunk = (inputName: CollectionFormField) => () => {
    setFormData((prev) => {
      return {
        ...prev,
        [inputName]: {
          ...prev[inputName],
          src: '',
          value: undefined,
          isDeleted: true
        } as ImageInput
      };
    });
  };

  const getEmptyNameAndLinkInput = () => {
    const emptyNameAndLink: NameAndLinkInput = {
      name: '',
      link: ''
    };

    return {
      [uniqueId()]: emptyNameAndLink
    };
  };

  const addEmptyNameAndLinkThunked = (name: CollectionFormField) => () => {
    const emptyState = getEmptyNameAndLinkInput();
    setFormData((prev) => {
      return {
        ...prev,
        [name]: {
          ...prev[name],
          value: {
            ...((prev[name] as NameAndLinkInputs)?.value ?? {}),
            ...emptyState
          }
        }
      };
    });
  };

  const getEmptyMultipleTextInput = () => {
    const emptyText = {
      value: ''
    };
    return {
      [uniqueId()]: emptyText
    };
  };

  const addEmptyMultipleTextThunked = (name: CollectionFormField) => () => {
    const emptyState = getEmptyMultipleTextInput();

    setFormData((prev) => {
      return {
        ...prev,
        [name]: {
          ...prev[name],
          value: {
            ...((prev[name] as MultipleTextInputs)?.value ?? {}),
            ...emptyState
          }
        }
      };
    });
  };

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name: CollectionFormField = event.target.name as CollectionFormField;
    const id = event.target.getAttribute('datakey') ?? '';
    const property = event.target.getAttribute('dataproperty') ?? '';

    const value = event.target.value;

    const type = formData[name as CollectionFormField].type;

    switch (type) {
      case InputType.Text:
        setFormData((prev) => {
          return {
            ...prev,
            [name]: {
              ...prev[name],
              value
            }
          };
        });
        break;

      case InputType.Image:
        onImageUpload(event as ChangeEvent<HTMLInputElement>)
          .then(({ src, file }) => {
            setFormData((prev) => {
              return {
                ...prev,
                [name]: {
                  ...prev[name],
                  src,
                  value: file,
                  isDeleted: false
                }
              };
            });
          })
          .catch((err) => {
            showAppError(err);
          });

        break;

      case InputType.ArrayOfText:
        setFormData((prev) => {
          return {
            ...prev,
            [name]: {
              ...prev[name],
              value: {
                ...((prev[name] as MultipleTextInputs)?.value ?? {}),
                [id]: { value }
              }
            }
          };
        });
        break;

      case InputType.NameAndLinkArray:
        setFormData((prev) => {
          return {
            ...prev,
            [name]: {
              ...prev[name],
              value: {
                ...((prev[name] as NameAndLinkInputs)?.value ?? {}),
                [id]: {
                  ...((prev[name] as NameAndLinkInputs)?.value?.[id] ?? {}),
                  [property]: value
                }
              }
            }
          };
        });
        break;

      default:
        break;
    }
  };

  return (
    <>
      <Box display="flex" flexDirection={'column'} justifyContent={'center'} alignItems={'center'} margin="auto">
        <InputGroupWrapper>
          <Box display="flex" flexDirection={'row'} alignItems={'center'}>
            {formData[CollectionFormField.ProfileImage]?.src ? (
              <Image
                alt="collection profile image"
                src={formData[CollectionFormField.ProfileImage]?.src ?? ''}
                height={'104px'}
                marginRight={'48px'}
              />
            ) : (
              <Box width="104px" height={'104px'} marginRight={'48px'}>
                <FaImage size="104px" />
              </Box>
            )}
            <Box display="flex" flexDirection={'row'} minWidth={'300px'}>
              <Button
                marginRight={'16px'}
                flexBasis={0}
                flexGrow={1}
                onClick={() => {
                  inputFileRef.current?.click();
                }}
              >
                Upload new picture
              </Button>
              <input
                type="file"
                ref={inputFileRef}
                name={CollectionFormField.ProfileImage}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={onChangeHandler}
              />

              <Button
                variant={'alt'}
                flexBasis={0}
                flexGrow={1}
                onClick={onDeleteImageThunk(CollectionFormField.ProfileImage)}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </InputGroupWrapper>

        <HorizontalLine />

        <InputGroupWrapper title={'Edit Collection'}>
          <InputWithLabel
            title="Collection name"
            placeholder="Collection name"
            name={CollectionFormField.Name}
            value={formData.name?.value ?? ''}
            onChange={onChangeHandler}
          />

          <FormLabel htmlFor="description" size="lg" marginTop="32px">
            Description
          </FormLabel>
          <Textarea
            key={CollectionFormField.Description}
            id="description"
            placeholder="Collection description"
            name={CollectionFormField.Description}
            value={formData[CollectionFormField.Description]?.value ?? ''}
            onChange={onChangeHandler}
          />
        </InputGroupWrapper>
        <HorizontalLine />

        <InputGroupWrapper title={'Socials'}>
          <SimpleGrid spacingY="32px" columns={2} spacingX={'32px'} width="100%">
            {[
              { title: 'Twitter', placeholder: 'Twitter link', name: CollectionFormField.Twitter },
              { title: 'Discord', placeholder: 'Discord link', name: CollectionFormField.Discord },
              { title: 'External', placeholder: 'External link', name: CollectionFormField.External },
              { title: 'Medium', placeholder: 'Medium link', name: CollectionFormField.Medium },
              { title: 'Instagram', placeholder: 'Instagram link', name: CollectionFormField.Instagram },
              { title: 'Facebook', placeholder: 'Facebook link', name: CollectionFormField.Facebook },
              { title: 'Telegram', placeholder: 'Telegram link', name: CollectionFormField.Telegram },
              { title: 'Wiki', placeholder: 'Wiki link', name: CollectionFormField.Wiki }
            ].map((item) => {
              return (
                <InputWithLabel
                  key={item.title}
                  title={item.title}
                  placeholder={item.placeholder}
                  name={item.name}
                  value={(formData[item.name] as TextInput)?.value ?? ''}
                  onChange={onChangeHandler}
                />
              );
            })}
          </SimpleGrid>
        </InputGroupWrapper>
        <HorizontalLine />

        <InputGroupWrapper title={'Benefits'}>
          <SimpleGrid spacingY="32px" columns={2} spacingX={'32px'} width="100%">
            {[...Object.entries(formData[CollectionFormField.Benefits]?.value ?? {})].map(([key, item], index) => {
              return (
                <InputWithLabel
                  key={key}
                  datakey={key}
                  title={`Benefit`}
                  placeholder={`Benefit ${index + 1}`}
                  name={CollectionFormField.Benefits}
                  value={item?.value ?? ''}
                  onChange={onChangeHandler}
                />
              );
            })}
          </SimpleGrid>
        </InputGroupWrapper>
        <HorizontalLine />

        <InputGroupWrapper title={'Partnerships'}>
          <SimpleGrid spacingY="32px" columns={2} spacingX={'32px'} width="100%" marginBottom={'32px'}>
            {Object.entries(formData[CollectionFormField.Partnerships]?.value ?? {}).map(([key, value]) => {
              return (
                <Box display="flex" flexDirection={'column'} width="100%" key={key}>
                  <FormLabel size="lg">Partner</FormLabel>
                  <Input
                    placeholder={'Partner name'}
                    value={value?.name ?? ''}
                    name={CollectionFormField.Partnerships}
                    onChange={onChangeHandler}
                    marginBottom={'16px'}
                    datakey={key}
                    dataproperty={'name'}
                  />
                  <Input
                    placeholder={'Partnership website link'}
                    value={value?.link ?? ''}
                    name={CollectionFormField.Partnerships}
                    onChange={onChangeHandler}
                    datakey={key}
                    dataproperty={'link'}
                  />
                </Box>
              );
            })}
          </SimpleGrid>
          <Button variant={'alt'} size="lg" onClick={addEmptyNameAndLinkThunked(CollectionFormField.Partnerships)}>
            Add more partnerships
          </Button>
        </InputGroupWrapper>

        <Box
          display="flex"
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'flex-start'}
          marginBottom={'72px'}
          maxWidth={'750px'}
        >
          <Box
            display="flex"
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'flex-end'}
            maxWidth={'750px'}
            minWidth={['500', '600', '700', '750']}
          >
            <Button
              size="lg"
              onClick={() => {
                postForm();
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default EditCollectionForm;
